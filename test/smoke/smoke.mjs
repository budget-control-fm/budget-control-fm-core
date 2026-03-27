import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const repoRoot = resolve(process.cwd());
const tempRoot = mkdtempSync(join(tmpdir(), "budget-control-smoke-"));

function run(command, cwd) {
  execSync(command, {
    cwd,
    stdio: "inherit",
    env: {
      ...process.env,
    },
  });
}

function copyDir(src, dest) {
  cpSync(src, dest, { recursive: true });
}

function installPackedPackage(consumerDir, tarballPath) {
  run("npm install", consumerDir);
  run(`npm install "${tarballPath}"`, consumerDir);
}

let tarballPath;

try {
  // 1. Build the real publishable package
  run("npm run build", repoRoot);

  // 2. Pack it exactly as npm would publish it
  const packOutput = execSync("npm pack", {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();

  const tarballName = packOutput.split("\n").pop();
  tarballPath = join(repoRoot, tarballName);

  if (!existsSync(tarballPath)) {
    throw new Error(`Tarball not found: ${tarballPath}`);
  }

  // 3. Run TypeScript consumer smoke test
  {
    const src = join(repoRoot, "test", "smoke", "consumer-types");
    const dest = join(tempRoot, "test", "smoke", "consumer-types");
    copyDir(src, dest);
    installPackedPackage(dest, tarballPath);
    run("npm run typecheck", dest);
  }

  // 4. Run ESM runtime consumer smoke test
  {
    const src = join(repoRoot, "test", "smoke", "consumer");
    const dest = join(tempRoot, "test", "smoke", "consumer");
    copyDir(src, dest);
    installPackedPackage(dest, tarballPath);
    run("node index.mjs", dest);
  }

  console.log("All ESM smoke tests passed");
} finally {
  if (tarballPath && existsSync(tarballPath)) {
    rmSync(tarballPath, { force: true });
  }

  rmSync(tempRoot, { recursive: true, force: true });
}
