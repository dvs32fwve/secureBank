# SmartBank Backend

The backend is a Node.js + Express service that powers SmartBank with Firebase authentication, Firestore-backed user data, virtual card management, transfer processing, and governance-style review logic. It is designed to support a realistic banking demo rather than a production-grade banking platform.

## Key Features

- Firebase Admin verification of bearer tokens
- User profile creation and lookup from Firestore
- Virtual card creation, repair, and status updates
- Transfer execution with sender and recipient balance updates
- Rule-based transfer review for non-AU/NZ scenarios
- Audit logging for review-worthy transfers
- Lightweight in-memory caching for user and card reads
- Health-check endpoint for deployment readiness

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
cd backend
npm install
```

## Environment Setup

Create a local environment file:

```bash
cd backend
cp .env.example .env
```

Example values:

```env
PORT=5001
NODE_ENV=development
```

## Firebase Service Account

The backend requires a Firebase service account for Admin SDK access.

- serviceKey.example.json is a template
- serviceKey.json should contain your actual Firebase service account credentials
- The server uses these credentials to verify tokens and access Firestore

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

The default local URL is http://localhost:5001.

## API Endpoints

### Public
- GET /
- GET /health

### Protected
- POST /users
- GET /virtual-card
- POST /virtual-card/repair
- PATCH /virtual-card
- POST /transfer

## Transfer Behavior

- Authenticates the sender with a Firebase token
- Confirms the sender profile exists
- Validates the recipient email against Firestore users
- Ensures the sender has enough balance
- Applies review logic based on the transfer context and sends a clear security notice when needed
- Writes a Firestore batch for the sender and recipient transaction updates

## Data Model

- users: uid, name, email, photoURL, balance, role, createdAt
- virtualCards: userId, cardNumber, cardNumberMasked, expiry, status
- transactions: userId, type, amount, recipient, category, note, flagged, timestamp

## Tests

Run the backend test suite:

```bash
cd backend
npm test
```

## Project Structure

```text
backend/
├── server.js
├── package.json
├── .env.example
├── serviceKey.example.json
├── serviceKey.json
├── utils/
│   ├── cache.js
│   └── transferRules.js
└── tests/
```
