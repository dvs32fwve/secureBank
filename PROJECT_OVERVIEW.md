# SecureBank Project Overview

SecureBank is a full-stack demo banking application built with React, TypeScript, Firebase, and Node.js. It combines a responsive frontend, a secure backend API, and Firestore-backed data storage to showcase a modern banking experience with authentication, transactions, virtual cards, and admin controls.

## Project Summary

The project is split into two main packages:

- `backend/` — Express server that verifies Firebase tokens, manages user profiles, generates virtual cards, and processes transfers.
- `frontend/` — React + Vite application for customers and admins, including role-based dashboards and a hidden `/api-docs` page.

## Features

### Core Functionality

- User authentication with Firebase Google sign-in
- Firestore-backed user profiles and transaction history
- Virtual card support with automatic creation and repair
- Secure transfer flow with sender/recipient balance updates
- Transfer flagging for high-value transactions (> $1000)
- Admin views for user and transaction monitoring
- Separate customer and admin dashboards
- Public API documentation page at `/api-docs`, hidden from the main sidebar menu

### Frontend Experience

- Modern responsive UI with Tailwind and Framer Motion
- Protected authenticated routes with `ProtectedRoute`
- Role-aware redirects and separate dashboards for customers and admins
- Live Firestore profile sync via `AuthContext`
- Demo store experience using virtual card checkout
- Real-time dashboard updates for balance and transactions
- Clear admin pages for user and transaction review

### Backend Responsibilities

- Validate Firebase ID tokens on protected routes
- Create or fetch user profiles from Firestore
- Generate and repair virtual cards stored in Firestore
- Update card status between `active` and `blocked`
- Execute transfers in Firestore batches
- Cache user and card reads to improve performance

## API Endpoints

### Public Endpoints

- `GET /` — Welcome response
- `GET /health` — Health check endpoint

### Protected Endpoints

All protected endpoints require `Authorization: Bearer <token>`.

- `POST /users` — Create or return the current user profile
- `GET /virtual-card` — Return the authenticated user's virtual card
- `POST /virtual-card/repair` — Recreate or repair the user's card
- `PATCH /virtual-card` — Update virtual card status
- `POST /transfer` — Transfer money to another user by email

## Frontend Routes

- `/home` — Landing page
- `/features` — Product feature page
- `/about` — About page
- `/contact` — Contact page
- `/login` — Sign in page
- `/dashboard` — User dashboard
- `/balance` — Balance page
- `/transfer` — Transfer page
- `/transactions` — Transaction history page
- `/profile` — Profile page
- `/card` — Virtual card page
- `/store` — Demo storefront
- `/admin/users` — Admin user list
- `/admin/transactions` — Admin transaction review
- `/api-docs` — API documentation page

## Technologies Used

### Backend

- Node.js
- Express
- Firebase Admin SDK
- Firestore
- CORS
- dotenv
- nodemon (dev)

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Firebase client SDK
- Wouter
- Lucide React
- Framer Motion
- Sonner
- React Hook Form
- Zod
- Recharts

## Deployment and Running

### Backend

```bash
cd backend
npm install
npm run dev
```

Default server URL: `http://localhost:5001`

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

Default app URL: `http://localhost:5173`

## Environment Setup

### Backend

Use `backend/.env.example` to create `backend/.env`:

```env
PORT=5001
NODE_ENV=development
```

### Frontend

Use `frontend/.env.example` to create `frontend/.env` and add Firebase config and backend URL:

```env
VITE_BACKEND_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Notable Implementation Notes

- The frontend `AuthContext` listens for Firebase auth state changes and keeps user data synchronized with Firestore.
- The backend uses in-memory caching for user and virtual card reads to reduce repeated Firestore queries.
- Transfers are performed with Firestore batch writes to ensure both sender and recipient balances update together.
- The API docs page is intentionally hidden from the sidebar menu but still accessible directly.

## Useful Commands

### Backend

- `npm run dev` — start backend in development
- `npm start` — start backend in production

### Frontend

- `pnpm run dev` — start frontend development server
- `pnpm run build` — produce production assets
- `pnpm run serve` — preview production build
- `pnpm run typecheck` — run TypeScript checks

## Contact and Support

For support, inspect browser console logs and backend terminal output. Confirm both frontend and backend are using the correct `.env` settings and Firebase credentials.
