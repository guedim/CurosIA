# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

E-commerce data utilities project providing query functions against a SQLite database. TypeScript, ESM modules, executed via `tsx`.

## Development Commands

```bash
npm run setup          # Install deps + generate .claude/settings.local.json
npx tsx src/main.ts    # Run the entry point (creates DB + schema)
npx tsx sdk.ts         # Run the Agent SDK script
```

No test framework is configured.

## Architecture

**Database layer**: Uses the `sqlite` npm package (promise-based wrapper over `sqlite3`). All `db.get()` and `db.all()` calls return Promises directly — use `await`, not callbacks.

**Schema** (`src/schema.ts`): Creates all tables via `db.exec()`. Tables: `customers`, `addresses`, `categories`, `products`, `inventory`, `warehouses`, `orders`, `order_items`, `reviews`, `customer_segments`, `promotions`, `customer_activity_log`.

**Queries** (`src/queries/`): Eight modules organized by domain. Each module defines local TypeScript interfaces for its return types and exports async functions that take a `Database` instance as the first parameter.

**Entry point** (`src/main.ts`): Opens `ecommerce.db` and runs `createSchema()`.

## Query Pattern

All queries use the promise-based `sqlite` API — no callbacks:

```typescript
import { Database } from "sqlite";

export async function getCustomerByEmail(db: Database, email: string): Promise<any> {
  const query = `SELECT * FROM customers WHERE email = ?`;
  return await db.get(query, [email]);  // returns Promise directly
}
```

- Single record: `db.get()` — returns `Promise<T | undefined>`
- Multiple records: `db.all()` — returns `Promise<T[]>`
- Use parameterized queries (`?` placeholders) for all user inputs
- Complex queries compose multiple sequential `db.get()`/`db.all()` calls and assemble results in JS

## Critical Guidance

- All database queries must be written in `./src/queries/`
