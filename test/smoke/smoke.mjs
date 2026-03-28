// test/smoke/smoke.mjs
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
  if (!existsSync(src)) {
    throw new Error(`Smoke fixture directory not found: ${src}`);
  }

  cpSync(src, dest, { recursive: true });
}

function installPackedPackage(consumerDir, tarballPath) {
  run("npm install", consumerDir);
  run(`npm install "${tarballPath}"`, consumerDir);
}

let tarballPath;

try {
  run("npm run build", repoRoot);

  const packOutput = execSync("npm pack", {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();

  const tarballName = packOutput.split("\n").pop();
  tarballPath = join(repoRoot, tarballName);

  if (!existsSync(tarballPath)) {
    throw new Error(`Tarball not found: ${tarballPath}`);
  }

  {
    const src = join(repoRoot, "test", "smoke", "consumer-types");
    const dest = join(tempRoot, "consumer-types");
    copyDir(src, dest);
    installPackedPackage(dest, tarballPath);
    run("npm run typecheck", dest);
  }

  {
    const src = join(repoRoot, "test", "smoke", "consumer-esm");
    const dest = join(tempRoot, "consumer-esm");
    copyDir(src, dest);

    const fixturesSrc = join(repoRoot, "test", "smoke", "fixtures");
    const fixturesDest = join(dest, "fixtures");
    copyDir(fixturesSrc, fixturesDest);

    installPackedPackage(dest, tarballPath);
    run("node register-user.mjs", dest);
  }

  console.log("All ESM smoke tests passed");
} finally {
  if (tarballPath && existsSync(tarballPath)) {
    rmSync(tarballPath, { force: true });
  }

  rmSync(tempRoot, { recursive: true, force: true });
}
