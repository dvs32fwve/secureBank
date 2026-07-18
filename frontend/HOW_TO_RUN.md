# Frontend How to Run

This frontend runs the SmartBank user interface with Firebase authentication, protected routes, dashboards, transfer flows, and admin review views.

## Prerequisites

- Node.js 18+
- pnpm

## Install dependencies

```bash
cd frontend
pnpm install
```

## Environment

Create a local environment file:

```bash
cd frontend
cp .env.example .env
```

Example values:

```env
VITE_BACKEND_URL=http://localhost:5001
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Run in development mode

```bash
cd frontend
pnpm run dev
```

Open http://localhost:5173.

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

## Notes

- The app uses the backend URL from VITE_BACKEND_URL for all API requests.
- The frontend automatically trims redundant slashes in API paths.
- The hidden /api-docs page is available directly by URL.
