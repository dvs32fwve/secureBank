# SmartBank Backend

The backend is a Node.js + Express server that powers SmartBank with Firebase authentication verification, user profile management, virtual card generation, and transfer processing. It also supports CAIGA-inspired rule-based transfer checks and audit logging.

## Key Features

- Firebase token authentication using `firebase-admin`
- Secure user profile creation and lookup
- Virtual card generation, validation, repair, and status updates
- Money transfer endpoint with sender/recipient balance updates, transaction records, and CAIGA-style rule-based fraud flagging
- Firestore batch writes to keep transfers consistent
- In-memory TTL caching for user and virtual card reads
- Health check endpoint for deployment readiness

## Prerequisites

- Node.js 18 or higher
- npm

## Installation

```bash
cd backend
npm install
```

## Environment Setup

Copy the example environment file and set the runtime variables:

```bash
cd backend
cp .env.example .env
```

Example `.env` values:

```env
PORT=5001
NODE_ENV=development
```

## Firebase Service Account

The backend uses Firebase Admin SDK with a service account key file.

- `serviceKey.example.json` is the example template
- `serviceKey.json` should contain your Firebase service account credentials
- The server uses this file to verify Firebase tokens and read/write Firestore data

## Running the Server

### Development

```bash
cd backend
npm run dev
```

### Production

```bash
cd backend
npm start
```

The backend runs on `http://localhost:5001` by default.

## API Endpoints

### Public

- `GET /` — Welcome response
- `GET /health` — Health check

### Protected (Bearer token required)

- `POST /users` — Create or return the authenticated user profile
- `GET /virtual-card` — Retrieve the current user virtual card
- `POST /virtual-card/repair` — Repair or regenerate the user virtual card
- `PATCH /virtual-card` — Update card status (`active` or `blocked`)
- `POST /transfer` — Send money to another user by recipient email

## Transfer Behavior

- Validates the authenticated sender via Firebase token
- Verifies the sender profile exists
- Checks recipient email against Firestore users
- Ensures sufficient sender balance
- Applies flagged status for transfer amounts above $1000 using transparent rule-based limits
- Writes both sender and recipient transaction records in a Firestore batch

## Data Model

- `users` collection: stores `uid`, `name`, `email`, `photoURL`, `balance`, `role`, `createdAt`
- `virtualCards` collection: stores `userId`, `cardNumber`, `cardNumberMasked`, `expiry`, `status`
- `transactions` collection: stores `userId`, `type`, `amount`, `recipient`, `category`, `note`, `flagged`, `timestamp`

## Project Structure

```
backend/
├── server.js
├── package.json
├── .env.example
├── .env
├── serviceKey.example.json
├── serviceKey.json
├── utils/
│   └── cache.js
└── tests/
```

## Health Check

```bash
curl http://localhost:5001/health
```

Expected response:

```json
{ "status": "OK", "timestamp": "..." }
```
