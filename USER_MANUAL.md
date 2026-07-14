# SecureBank User Manual

This user manual explains how to use the SecureBank application from the customer and admin perspectives. It covers the main features, navigation, and behavior in local and production environments.

## Getting Started

### Access the App

- **Frontend URL (production)**: `https://securebank-6may.onrender.com`
- **Backend URL (production)**: `https://securebankbackend-thbc.onrender.com`
- **Local development**:
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:5001`

### Sign in

- Click `Sign In` on the homepage.
- Sign in using Google authentication.
- After signing in, customers are redirected to `/dashboard`.
- Admin users are redirected to `/admin/dashboard`.

## Customer Experience

### Home Page

- Visit `/home` for the landing page.
- Use the top navigation to access `Features`, `About`, `Contact`, or `Sign In`.

### Dashboard

- `/dashboard` shows your current balance, recent transactions, and quick actions.
- If you are an admin, you will see `/admin/dashboard` instead.

### Balance Page

- `/balance` displays your account balance and summary of recent activity.
- Use this page to confirm your current funds before making transfers.

### Transfer Money

- Go to `/transfer` to send money to another user.
- Required fields:
  - Recipient email
  - Amount
  - Category
  - Optional note
- Transfers above $1,000 are flagged for review, and you will see a warning before you confirm.
- The backend validates that the recipient exists and that you have sufficient funds.

### Virtual Card

- `/card` displays your virtual card details.
- If your card is invalid or missing, the app can generate or repair it automatically.
- Manage card status via the available controls.

### Store

- `/store` is a demo purchase experience that uses your virtual card details.
- Complete checkout to simulate a transaction and see how purchases appear in your transaction history.

### Transactions

- `/transactions` shows your transaction history.
- Review transfers, deposits, and any flagged activity.

### Profile

- `/profile` shows your user information and account details.
- Use your profile page to verify your email and current role.

### Contact

- `/contact` allows you to reach out or submit feedback.

## Admin Experience

### Admin Dashboard

- `/admin/dashboard` provides admin-specific analytics and controls.
- Admin users can review system state and monitor flagged transactions.

### Admin Users

- `/admin/users` shows a list of registered users.
- Use this page to review user profiles and account status.

### Admin Transactions

- `/admin/transactions` lists all transactions across users.
- Admins can monitor flagged transfers and audit suspicious activity.

## Hidden API Docs

- The API docs page is intentionally hidden from the main navigation.
- Access it directly at `/api-docs`.
- This page documents backend routes for developers and auditors.

## Notes on Production and Deployment

### Backend URL Behavior

- In production, the app uses `VITE_BACKEND_URL` to target the backend.
- The frontend now automatically strips extra trailing slashes, so `https://securebankbackend-thbc.onrender.com/` and `https://securebankbackend-thbc.onrender.com` both work.

### Known Deployment Hosts

- Frontend: `https://securebank-6may.onrender.com`
- Backend: `https://securebankbackend-thbc.onrender.com`

## Troubleshooting

### Common Issues

- If you see errors calling backend APIs, refresh the page or clear the browser cache.
- Ensure you are signed in before accessing protected pages.
- If a transfer fails, verify the recipient email is registered and that you have enough balance.

### If Transfer Fails

- Confirm the recipient email is a valid registered user.
- Check for insufficient funds.
- Transfers above $1,000 may be flagged by fraud rules.

### If Virtual Card Errors Appear

- Make sure you are signed in and the backend is available.
- The system regenerates cards automatically if needed.

## Additional Resources

- `frontend/README.md` — frontend developer and setup docs
- `backend/README.md` — backend developer and setup docs
- `PROJECT_OVERVIEW.md` — high-level project summary and deployment notes
