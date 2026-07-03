# SecureBank AI

A secure, modern banking application built with React, TypeScript, and Firebase. Features user authentication, transaction management, card operations, and admin controls.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Firebase Setup](#firebase-setup)
- [Firestore Rules](#firestore-rules)
- [Scripts](#scripts)
- [Deployment](#deployment)

## Features

- **Secure Authentication** - Firebase Auth with Google sign-in
- **Animated Landing Pages** - Home, Features, About, and Contact pages with motion effects
- **Unified Navigation** - Consistent site menu with `Dashboard` replacing `Sign In` for logged-in users
- **Contact Form** - Sends submissions to Firestore `contact_form`
- **User Profiles** - Manage account information and settings
- **Card Management** - View and manage bank cards
- **Balance Tracking** - Real-time account balance updates
- **Transaction History** - Detailed transaction records with filters
- **Fund Transfers** - Secure money transfers between accounts
- **Admin Dashboard** - User management and transaction monitoring
- **Modern UI** - Beautiful, responsive design with Tailwind CSS
- **Notifications** - Toast notifications with Sonner
- **Mobile Responsive** - Works seamlessly on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: React Context API
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Routing**: Wouter
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form, Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ (v22.13.1 recommended)
- pnpm package manager
- Firebase project account
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd securebank
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

## Environment Setup

1. **Create a `.env` file** in the root directory:
   ```bash
   cp .env.example .env
   ```

2. **Add Firebase credentials** to `.env`:
   ```
   VITE_FIREBASE_API_KEY=API_KEY
   VITE_FIREBASE_AUTH_DOMAIN=AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID=PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET=STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID=MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID=APP_ID
   ```

Get these values from the [Firebase Console](https://console.firebase.google.com/).

## Running the Project

### Development Server
```bash
PORT=5173 BASE_PATH=/ pnpm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
pnpm run build
```

### Preview Production Build
```bash
pnpm run serve
```

### Type Check
```bash
pnpm run typecheck
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # UI component library (Radix UI)
│   ├── Layout.tsx      # Main layout wrapper
│   ├── ProtectedRoute.tsx
│   └── FraudBanner.tsx
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Balance.tsx
│   ├── Transfer.tsx
│   ├── Transactions.tsx
│   ├── Profile.tsx
│   ├── Card.tsx
│   ├── admin/          # Admin pages
│   │   ├── AdminUsers.tsx
│   │   └── AdminTransactions.tsx
│   └── not-found.tsx
├── context/            # React Context
│   └── AuthContext.tsx # Authentication state
├── firebase/           # Firebase configuration
│   ├── config.ts       # Firebase initialization
│   ├── auth.ts         # Auth functions
│   └── firestore.ts    # Firestore operations
├── hooks/              # Custom hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                # Utilities
│   └── utils.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Firebase Setup

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Enable Google Sign-In in Authentication

### 2. Initialize Firestore
- Enable Cloud Firestore database
- Start in test mode initially, then secure with rules

### 3. Create Composite Index
The app uses a composite index for transaction queries:
- Collection: `transactions`
- Fields: `userId` (Ascending), `timestamp` (Descending)

A prompt appears to create this index when transactions are first queried.



## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Build for production |
| `pnpm run serve` | Preview production build |
| `pnpm run typecheck` | Run TypeScript type checking |

## Deployment

### Deploy to other platforms
The `dist/` folder contains the production build and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## Key Features Explained

### Authentication
- Users sign in with Google OAuth
- Session persisted with Firebase Auth
- Protected routes check authentication state

### Transactions
- Stored in Firestore with timestamps
- Indexed for fast queries by user
- Support for multiple transaction types

### Admin Features
- Admin dashboard at `/admin/users`
- View all users and transactions
- Role-based access control

### UI/UX
- Responsive design for mobile and desktop
- Toast notifications for user feedback
- Loading states and error handling
- Accessible components from Radix UI

## Troubleshooting

**Firebase Invalid API Key Error**
- Ensure Firebase credentials are correct in `.env`
- Regenerate credentials in Firebase Console if needed

**Firestore Index Required**
- Create the composite index as shown in Firebase Console
- Index creation usually takes a few minutes

**Port Already in Use**
- Change `PORT` environment variable: `PORT=3000 pnpm run dev`

**Build Errors**
- Clear cache: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- Check Node version: `node --version`

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please refer to the [Firebase Documentation](https://firebase.google.com/docs) or check the project's issue tracker.
