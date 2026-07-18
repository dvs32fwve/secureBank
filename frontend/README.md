# SmartBank Frontend

The frontend is a Vite-powered React + TypeScript application for SmartBank. It connects to Firebase for authentication and Firestore data, and it calls the backend for user profile, transfer, and virtual card operations. The current UI focuses on a polished banking demo with role-based dashboards, security notices, and admin review tools.

## Features

- Google sign-in through Firebase Auth
- Customer and admin dashboards with role-aware navigation
- Live balance and transaction views
- Secure transfer flow with review messaging for non-AU/NZ activity
- Virtual card generation, repair, and status handling
- Store-style purchase experience using virtual card details
- Admin transaction review and flag-clearing actions
- Paginated transaction lists for better browsing of long histories
- Hidden API documentation at /api-docs
- Responsive layout with Tailwind, Framer Motion, and toast feedback

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
- Firebase project access

## Installation

```bash
cd frontend
pnpm install
```

## Environment Setup

Create a local environment file:

```bash
cd frontend
cp .env.example .env
```

Add your Firebase credentials and backend URL:

```env
VITE_BACKEND_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

For production, use:

```env
VITE_BACKEND_URL=https://smartbankbackend-thbc.onrender.com
```

The app normalizes backend URLs and removes unnecessary trailing slashes when sending requests.

## Running the App

### Development
```bash
cd frontend
pnpm run dev
```

Open http://localhost:5173.

### Production build
```bash
cd frontend
pnpm run build
```

### Preview build
```bash
cd frontend
pnpm run serve
```

### Type checking
```bash
cd frontend
pnpm run typecheck
```

## Frontend Routes

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

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── Avatar.tsx
│   │   ├── FraudBanner.tsx
│   │   ├── Layout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── firebase/
│   │   ├── auth.ts
│   │   ├── config.ts
│   │   └── firestore.ts
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   │   ├── admin/
│   │   ├── ApiDocs.tsx
│   │   ├── Balance.tsx
│   │   ├── Card.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Transfer.tsx
│   │   ├── Transactions.tsx
│   │   └── ...
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Key Components

- AuthContext.tsx: syncs auth state and Firestore profile data
- ProtectedRoute.tsx: guards authenticated pages
- Layout.tsx: shared navigation and app shell
- ApiDocs.tsx: hidden developer documentation page
- Transfer.tsx: transfer flow with governance messaging
- Dashboard.tsx: account overview and recent activity

## Notes

- /api-docs is accessible by direct URL but hidden from the main navigation
- Transfer activity is designed to be explainable and auditable for demo purposes
- Virtual cards are created automatically when a user first signs in
