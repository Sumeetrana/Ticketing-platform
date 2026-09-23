# Conventions

Applies to every service in this repo. Reviewed against on each change.

## Types

- **No `any`.** Use `unknown` and narrow. `any` disables checking and hides real bugs.
- **No `!` non-null assertions** except on DTO field declarations.
- **`string` / `number` / `boolean`, never `String` / `Number` / `Boolean`.** The capitalised forms are boxed objects.
- **`import type` for types, plain `import` for anything injected.** A service imported with `import type` is erased at compile time, so DI silently injects `undefined`.
- **`node:` prefix on Node builtins** — `import { randomUUID } from 'node:crypto'`.
- `strict: true` and `strictPropertyInitialization: true` in every service.

## Structure

- **Controllers are 1–3 lines.** Translate HTTP to a service call. No logic, no branching, no shaping.
- **Modules export only what others need.** Default to exporting nothing.
- **Dependency arrows point one way.** Features depend on integrations, never the reverse.
- **Barrels are filled or deleted.** An empty `index.ts` is worse than no file.
- One folder per feature: `module.ts`, `controller.ts`, `service.ts`, `dto/`, `index.ts`.

## DTOs

- **Request and response DTOs are separate classes.** If identical, the response is missing server-computed fields.
- **Request DTOs contain only what the client may decide.** Never `id`, `createdAt`, `updatedAt`, `status`, or anything else the server owns.
- **Response DTOs are `readonly` and carry no `class-validator` decorators.**
- **Optional needs both `?` and `@IsOptional()`.** They are independent.
- **`@IsInt()` not `@IsNumber()`** for whole numbers — `@IsNumber()` accepts `2.7`.
- **No `@IsNotEmpty()` on numbers.** It is a string/array check.
- **Cap every list endpoint**: `@Max(100)` on `limit`, `@Min(1)` on `page`.
- **Whitelist anything naming a column** — `sortBy` without `@IsIn([...])` is an injection vector.

## Errors

- **Throw, never return an error value.** `return "not found"` yields a 200 containing a sentence.
- **Messages are actionable**: `Zone 'PIZZA' does not exist. Available: A, B, C`.
- **Never leak internals.** Log the real exception; return a safe message.
- **Domain exceptions carry a stable `code`** clients can switch on, separate from the human message.

## Money and time

- **Money is integers or `Decimal`. Never `Float`.**
- **Calendar dates are `@db.Date`; instants are `Timestamptz`.**
- **ISO strings at API boundaries** — `Date` does not survive JSON.

## Database

- **Never read-then-write on contended data.** Use a conditional update or a constraint.
- **Multi-write operations run in a transaction**, and everything inside uses the transaction client.
- **Always `orderBy` with pagination**, or pages can repeat rows.
- **Indexes follow access patterns**, which you know because you wrote the endpoints.
- **Migrations are committed.**

## Operations

- **No `console.log`.** Structured logging, object first: `logger.info({ orderId }, 'Order confirmed')`.
- **Never log secrets**; prefer not logging headers at all over redacting them.
- **No raw `process.env` outside the config factory.**
- **Config defaults are the safe-to-be-wrong value** — `NODE_ENV` defaults to `development`, not `production`.
- **Liveness probes never touch a dependency.** Readiness gates only on what the service cannot work without.

## Process

- **Run it before calling it done.**
- **Conventional commits with a scope**: `feat(inventory-svc): add event listing`.
- **`.env` gitignored, `.env.example` committed.**
