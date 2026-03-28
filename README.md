# budget-control-fm-core

Shared domain logic and application primitives for the Budget Control Financial Management ecosystem.

This package provides reusable value objects, entities, and use cases consumed by services such as ingestion pipelines, classification engines, and API adapters. It is designed around hexagonal architecture: domain logic is pure and infrastructure-free; adapters are implemented by the consuming service, not here.

This package is **ESM-only**.

---

## Requirements

- Node.js **24 or later**
- An **ESM-compatible environment** (`"type": "module"` in your `package.json`, or `.mjs` files)

If your project still uses CommonJS, you must migrate to ESM before using this library.

---

## Installation

```sh
npm install budget-control-fm-core
```

---

## Import model

This package exposes a **subpath-only API**. There is no root `budget-control-fm-core` entry point. Every import must target a named subpath:

```ts
// ✅ correct
import { RegisterUserUseCase } from "budget-control-fm-core/user";

// ❌ will throw ERR_PACKAGE_PATH_NOT_EXPORTED
import { ... } from "budget-control-fm-core";
```

This is intentional. As the library grows across domains (`user`, `transaction`, `budget`, ...), each subpath forms an independent module boundary. Only import the domain you actually depend on.

### Available subpaths

| Subpath                       | Contents                                                     |
| ----------------------------- | ------------------------------------------------------------ |
| `budget-control-fm-core/user` | `RegisterUserUseCase`, command/result types, port interfaces |

---

## API

### `budget-control-fm-core/user`

#### `RegisterUserUseCase`

Orchestrates new user registration. Validates domain rules, delegates credential creation to an auth service, and persists the user profile.

```ts
import { RegisterUserUseCase } from "budget-control-fm-core/user";
import type {
  RegisterUserCommand,
  RegisterUserResult,
  AuthServicePort,
  UserProfileRepositoryPort,
} from "budget-control-fm-core/user";
```

**Constructor**

```ts
new RegisterUserUseCase(
  idGenerator: IdGeneratorPort,
  clock: ClockPort,
  authService: AuthServicePort,
  userProfileRepository: UserProfileRepositoryPort,
)
```

Dependencies are injected by the consuming service. None of these ports are implemented here; you provide concrete adapters.

**`execute(command: RegisterUserCommand): Promise<RegisterUserResult>`**

```ts
const result = await useCase.execute({
  fullName: "Jane Doe",
  email: "jane@example.com",
  password: "secret",
  birthDate: "1990-06-15", // YYYY-MM-DD
});

console.log(result.userId); // UUID string
```

Throws `TypeError` if:

- `fullName` is fewer than 3 characters, or has no space (first + last name required)
- `email` is not a valid email address
- `birthDate` is not a valid `YYYY-MM-DD` date
- the user is under 18 years old on the registration date

#### Port interfaces

Your service must implement these interfaces and inject them:

**`AuthServicePort`**

```ts
interface AuthServicePort {
  registerUser(user: User, password: string): Promise<void>;
}
```

**`UserProfileRepositoryPort`**

```ts
interface UserProfileRepositoryPort {
  save(user: User): Promise<void>;
}
```

**`IdGeneratorPort`**

```ts
interface IdGeneratorPort {
  generate(): string; // must return a valid UUIDv4
}
```

**`ClockPort`**

```ts
interface ClockPort {
  today(): string; // must return YYYY-MM-DD
}
```

#### Command and result types

```ts
interface RegisterUserCommand {
  fullName: string;
  email: string;
  password: string;
  birthDate: string; // YYYY-MM-DD
}

interface RegisterUserResult {
  userId: string; // UUIDv4
}
```

---

## TypeScript path aliases

For normal package consumption, always use the published subpath import:

```ts
import { RegisterUserUseCase } from "budget-control-fm-core/user";
```

Only use TypeScript `paths` overrides for **local monorepo development**.

If needed, align them with the current source structure:

```json
{
  "compilerOptions": {
    "paths": {
      "budget-control-fm-core/user": [
        "../budget-control-fm-core/src/user/index.ts"
      ]
    }
  }
}
```

Current source entrypoint:

```txt
src/user/index.ts
```

Do not reference outdated paths such as `src/application/...` or `dist/application/...`.

---

## Development

```sh
git clone https://github.com/budget-control-fm/budget-control-fm-core.git
cd budget-control-fm-core
npm install
```

### Scripts

| Command                 | Description                                   |
| ----------------------- | --------------------------------------------- |
| `npm run lint`          | Lint with Biome                               |
| `npm run lint:fix`      | Auto-fix lint issues                          |
| `npm run format`        | Format source files                           |
| `npm run typecheck`     | TypeScript type check (no emit)               |
| `npm test`              | Run unit tests                                |
| `npm run test:coverage` | Tests with coverage report                    |
| `npm run build`         | Compile publishable output to `dist/`         |
| `npm run clean`         | Remove `dist/`                                |
| `npm run smoke`         | Validate the packed ESM package as a consumer |
| `npm run sonar`         | Run SonarQube analysis                        |

### Repository structure

```txt
src/user/index.ts
dist/user/index.js
dist/user/index.d.ts
```

### Adding a new domain module

1. Create `src/<domain>/index.ts` as the barrel for that domain.
2. Add the subpath to the `exports` map in `package.json`:

```json
"./transaction": {
  "import": "./dist/transaction/index.js",
  "types": "./dist/transaction/index.d.ts"
}
```

3. If using local TS path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "budget-control-fm-core/transaction": ["./src/transaction/index.ts"]
    }
  }
}
```

4. Export only what downstream consumers need.
5. Add/update smoke tests for the new subpath.

---

## Release process

This project uses Changesets.

```sh
npm run lint && npm run typecheck && npm test && npm run smoke
```

---

## Contributing

- Follow kebab-case with suffixes (`.vo.ts`, `.entity.ts`, `.use-case.ts`, etc.)
- Use `private constructor` + `Object.freeze(this)`
- Throw `TypeError` for invalid domain input
- Keep domain free of infrastructure dependencies
- Expose public API via `src/<domain>/index.ts`

---

## License

ISC
.....
