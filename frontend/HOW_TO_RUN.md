# Frontend How to Run

This frontend is a Vite-powered React application that connects to Firebase and the SmartBank backend. It now surfaces CAIGA governance and rule-based fraud decisioning in the homepage and feature pages.

## Prerequisites

- Node.js 18 or higher
- pnpm

## Install dependencies

```bash
cd frontend
pnpm install
```

## Environment

Create a `.env` file in the `frontend/` directory based on `frontend/.env.example`:

```bash
cd frontend
cp .env.example .env
```

### Example `.env` values

```env
VITE_BACKEND_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

For production deployment, use:

```env
VITE_BACKEND_URL=https://smartbankbackend-thbc.onrender.com
```

The frontend code normalizes backend URLs and removes redundant slashes when building API request paths.

## Run in development mode

```bash
cd frontend
pnpm run dev
```

Open `http://localhost:5173` in your browser.

## Build for production

```bash
cd frontend
pnpm run build
```

## Preview a production build

```bash
cd frontend
pnpm run serve
```

## Type checking

```bash
cd frontend
pnpm run typecheck
```
