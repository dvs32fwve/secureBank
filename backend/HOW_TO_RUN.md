# Backend How to Run

This backend powers the SmartBank API with Firebase-authenticated user access, card management, transfer execution, and transfer review logic.

## Prerequisites

- Node.js 18+
- npm

## Install dependencies

```bash
cd backend
npm install
```

## Environment

Create a local environment file from the example:

```bash
cd backend
cp .env.example .env
```

Example values:

```env
PORT=5001
NODE_ENV=development
```

## Run in development mode

```bash
cd backend
npm run dev
```

## Run in production mode

```bash
cd backend
npm start
```

## Verify the backend

```bash
curl http://localhost:5001/health
```

Expected response:

```json
{ "status": "OK", "timestamp": "..." }
```

## Important endpoints

- GET /health
- POST /users
- GET /virtual-card
- POST /virtual-card/repair
- PATCH /virtual-card
- POST /transfer

## Tests

```bash
cd backend
npm test
```
