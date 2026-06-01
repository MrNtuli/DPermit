# DigiPermit Backend

Node.js / Express REST API for the DigiPermit compliance monitoring platform.

## Setup

1. Copy `.env.example` to `.env` and fill in Supabase credentials
2. Run SQL migrations in Supabase SQL Editor (in order):
   - `database/migrations/001` through `013`
   - `database/views/analytics_views.sql`
   - `database/seeds/001` through `005`
3. Install dependencies:

```bash
npm install
```

4. Seed demo users:

```bash
npm run seed
```

5. Start the server:

```bash
npm run dev
```

API runs at `http://localhost:3000`

## Health Check

```
GET http://localhost:3000/api/health
```

## Postman

Import `postman/DigiPermit-API.postman_collection.json`

## Important Limitation

DigiPermit does not issue official visas or replace government immigration authorities.
