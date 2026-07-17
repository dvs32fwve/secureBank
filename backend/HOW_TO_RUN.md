# Backend How to Run

This backend provides the SmartBank API and handles user profile creation, virtual card management, protected Firebase token verification, and CAIGA-style transfer evaluation.

## Prerequisites

- Node.js 14 or higher
- npm

## Install dependencies

```bash
cd backend
npm install
```

## Environment

Create a `.env` file in the `backend/` directory based on `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

### Example `.env` values

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

Open or test:

```bash
curl http://localhost:5001/health
```

Expected response:

```json
{ "status": "OK", "timestamp": "..." }
```

## Important endpoints

- `GET /health`
- `POST /users`
- `GET /virtual-card`
- `POST /virtual-card/repair`
- `PATCH /virtual-card`
