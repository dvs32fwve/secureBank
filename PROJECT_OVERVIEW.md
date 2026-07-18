# SmartBank Project Overview

SmartBank is a full-stack banking demo that combines a React + TypeScript frontend, an Express backend, and Firebase Firestore data to showcase a CAIGA-inspired governance experience. The prototype emphasizes transparent security decisions, auditability, and a polished admin/customer workflow for a realistic demo.

## Project Structure

- Backend: Express server with Firebase Admin authentication, Firestore access, virtual card handling, transfer processing, and audit logging.
- Frontend: Vite + React app with customer and admin dashboards, public marketing pages, protected routes, and a hidden API documentation view.

## Current Product Scope

### Customer experience
- Google sign-in and profile creation through Firebase Auth
- Personal dashboard with balance, recent transactions, and quick navigation
- Virtual card generation, repair, and status control
- Secure transfer flow that includes a plain-language security notice for non-Australia/New Zealand transfers
- Transaction history and store-style purchase simulation

### Admin experience
- Dedicated admin dashboard for monitoring flagged activity
- Transaction review list with admin actions to clear flagged status
- User and transaction management views for demo governance scenarios
- Paginated transaction lists to make long histories easier to review

### Security and governance demo features
- Rule-based transfer risk evaluation with CAIGA-style logic
- Frontend-supplied country metadata used during transfer evaluation
- Audit log entries for outside-region transfers
- Client IP display in the app shell for a more realistic security narrative
- Hidden API documentation route at /api-docs for developers and auditors

## Backend Responsibilities

- Validate Firebase ID tokens on protected routes
- Create or fetch Firestore-backed user profiles
- Generate and repair virtual cards
- Update card status between active and blocked
- Process transfers with balance updates and transaction records
- Evaluate transfer risk and write audit logs for review-worthy activity
- Use lightweight caching for user and card lookups

## Frontend Responsibilities

- Render the public marketing pages and auth flow
- Protect customer and admin routes with role-aware navigation
- Sync auth state and user data with Firestore
- Send transfer metadata to the backend for risk evaluation
- Display security notices, transaction history, and admin actions in an intuitive UI

## API Surface

### Public endpoints
- GET /
- GET /health

### Protected endpoints
- POST /users
- GET /virtual-card
- POST /virtual-card/repair
- PATCH /virtual-card
- POST /transfer

## Main Routes

- /home
- /features
- /about
- /contact
- /login
- /dashboard
- /balance
- /transfer
- /transactions
- /profile
- /card
- /store
- /admin/dashboard
- /admin/users
- /admin/transactions
- /api-docs

## Technology Stack

### Backend
- Node.js
- Express
- Firebase Admin SDK
- Firestore
- dotenv
- CORS
- nodemon

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

## Running the Project

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
pnpm install
pnpm run dev
```

## Environment Notes

- Backend uses environment values from backend/.env
- Frontend uses environment values from frontend/.env
- Firebase credentials and backend URL must be configured before signing in or making transfers

## Notes for Demo Use

- The app is designed as a working prototype rather than a production banking system
- Transfer decisions are intentionally transparent and explainable for presentation purposes
- Admin features focus on review, monitoring, and audit-style interactions rather than full banking operations
