# SmartBank Frontend

The frontend is a Vite-powered React + TypeScript application for SmartBank. It connects to Firebase for authentication and Firestore data, and it calls the backend for user profile and virtual card operations. The landing pages and feature flows now highlight CAIGA governance and transparent rule-based fraud detection.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the App](#running-the-app)
- [Frontend Routes](#frontend-routes)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Firebase & Backend Integration](#firebase--backend-integration)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
- [User Manual](../USER_MANUAL.md)

## Features

- Google sign-in authentication with Firebase Auth
- Separate customer `/dashboard` and admin `/admin/dashboard` experiences
- Live dashboard with balance and recent transaction updates
- Transaction history and secure transfer flow
- Virtual card generation, repair, and status control
- Demo store checkout using virtual card data
- Admin pages for user and transaction review
- Rule-based fraud detection rules and transaction flagging for large transfers, surfaced through CAIGA governance
- Hidden API documentation route accessible by direct URL only
- Responsive layout with modern UI and animations
- Toast notifications for user feedback
- Production backend URL normalization to avoid extra path slashes

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Wouter
- Firebase client SDK
- Lucide React
- Framer Motion
- Sonner
- React Hook Form
- Zod
- Recharts

## Prerequisites

- Node.js 18+
- pnpm
- Firebase project account

## Installation

```bash
cd frontend
pnpm install
```

## Environment Setup

Create a `.env` file from the example:

```bash
cd frontend
cp .env.example .env
```

Add the Firebase credentials and backend URL:

```env
VITE_BACKEND_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

For production, set:

```env
VITE_BACKEND_URL=https://smartbankbackend-thbc.onrender.com
```

The frontend now trims extra trailing slashes automatically, so both `https://smartbankbackend-thbc.onrender.com` and `https://smartbankbackend-thbc.onrender.com/` work.

## Running the App

### Development

```bash
pnpm run dev
```

Open `http://localhost:5173`.

### Production Build

```bash
pnpm run build
```

### Preview Production Build

```bash
pnpm run serve
```

### Type Checking

```bash
pnpm run typecheck
```

## Frontend Routes

- `/home` — public homepage
- `/features` — features overview
- `/about` — about page
- `/contact` — contact page
- `/login` — Google sign-in page
- `/dashboard` — customer dashboard
- `/admin/dashboard` — admin dashboard
- `/balance` — account balance page
- `/transfer` — send money flow
- `/transactions` — transaction history
- `/profile` — profile page
- `/card` — virtual card page
- `/store` — demo storefront
- `/admin/users` — admin user management
- `/admin/transactions` — admin transaction review
- `/api-docs` — public backend API docs (hidden from sidebar, direct access only)

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/                # UI library components
│   │   ├── Avatar.tsx
│   │   ├── FraudBanner.tsx
│   │   ├── Layout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.tsx    # Auth state, Firestore sync, backend calls
│   ├── firebase/
│   │   ├── auth.ts            # Firebase auth helpers
│   │   ├── config.ts          # Firebase initialization
│   │   └── firestore.ts       # Firestore and backend API wrappers
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminUsers.tsx
│   │   │   └── AdminTransactions.tsx
│   │   ├── ApiDocs.tsx
│   │   ├── Balance.tsx
│   │   ├── Card.tsx
│   │   ├── Contact.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Features.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   ├── Store.tsx
│   │   ├── Transfer.tsx
│   │   ├── Transactions.tsx
│   │   └── not-found.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Key Components

- `AuthContext.tsx` — keeps auth state, syncs the Firestore user doc, and ensures virtual card data
- `ProtectedRoute.tsx` — guards authenticated pages
- `Layout.tsx` — app shell and menu layout
- `ApiDocs.tsx` — hidden backend API docs page
- `Store.tsx` — demo purchase experience
- `Transfer.tsx` — transfer flow with backend API
- `Dashboard.tsx` — live balance and transaction view

## Firebase & Backend Integration

- Uses Firebase Auth to sign in with Google
- Sends `Authorization: Bearer <token>` to backend endpoints
- Stores user records in Firestore `users`
- Stores transactions in Firestore `transactions`
- Saves contact submissions in Firestore `contact_form`

## Notes

- `/api-docs` is accessible by direct URL but hidden from the sidebar menu
- Transfers larger than $1000 are flagged by the backend
- Virtual cards are generated automatically when a user logs in

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start the frontend dev server |
| `pnpm run build` | Build production assets |
| `pnpm run serve` | Preview production build |
| `pnpm run typecheck` | Run TypeScript checks |

## Troubleshooting

- Ensure `VITE_BACKEND_URL` is correct and the backend is running
- Check Firebase credentials in `.env`
- Verify Google sign-in is enabled in Firebase Auth
- If Firestore queries fail, confirm rules and indexes are configured

## Support

Review browser console logs and backend API responses for errors. Use the backend health endpoint to confirm connectivity.
