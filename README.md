# Daily Expense & Income Diary

Track daily income and expenses with full CRUD.

- `Api` - Node.js, Express, MongoDB (Mongoose), JSON-schema validation (ajv), Jest
- `FrontEnd` - React, TypeScript, Vite, Ant Design

Test user (created automatically when the API starts): `test@meblabs.com` / `testtest`

## Run with Docker

```bash
docker compose up
```

- App: http://localhost:3000
- API: http://localhost:4000
- MongoDB: `localhost:27018`

## Run without Docker

Requires Node 20 and MongoDB running on `localhost:27017`.

```bash
cd Api
cp .env.example .env
npm install
npm run dev
```

```bash
cd FrontEnd
npm install
npm run dev
```

## Tests

```bash
cd Api
npm test
```

Tests run against an in-memory MongoDB, so no database is needed.

## API structure

```
Api/
├── app.js            Express app
├── index.js          Connects to MongoDB, seeds the test user, starts the server
├── config.js         Transaction types, categories, sortable fields
├── controllers/      Request handlers
├── db/               Connection, test connection, seed
├── helpers/          Errors, JWT
├── middlewares/      Auth, validation, error handler
├── models/           User, Transaction
├── routes/           Route definitions
├── schema/           JSON schemas for request validation
└── specs/            API tests
```

## Endpoints

| Method | Path | |
|---|---|---|
| POST | /auth/login | Login, returns a token |
| GET | /auth/me | Current user |
| POST | /auth/logout | Logout |
| GET | /transactions | List |
| GET | /transactions/categories | Categories by type |
| GET | /transactions/:id | Get one |
| POST | /transactions | Create |
| PUT | /transactions/:id | Update |
| DELETE | /transactions/:id | Delete |

Transaction routes need `Authorization: Bearer <token>`.

List query: `type`, `category`, `search`, `sortBy` (`date`, `amount`, `category`, `type`), `sortOrder` (`asc`, `desc`).

Example body:

```json
{
  "type": "expense",
  "amount": 250.5,
  "category": "Food",
  "date": "2026-10-01",
  "description": "Lunch"
}
```
