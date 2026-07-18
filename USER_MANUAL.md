# SmartBank User Manual

This manual describes the current SmartBank experience from the perspective of a customer, an admin, and a developer. It reflects the latest demo flow for authentication, transfers, virtual cards, and governance-style review.

## Getting Started

### Access the app
- Local frontend: http://localhost:5173
- Local backend: http://localhost:5001
- Production frontend: https://smartbank-6may.onrender.com
- Production backend: https://smartbankbackend-thbc.onrender.com

### Sign in
- Open the landing page and choose Sign In.
- Sign in with Google through Firebase Auth.
- Customers are redirected to /dashboard.
- Admin users are redirected to /admin/dashboard.

## Customer Experience

### Home and marketing pages
- Visit /home to see the public landing experience.
- Use the navigation to reach Features, About, Contact, or Sign In.
- The landing pages now highlight CAIGA-style governance and transparent security messaging.

### Dashboard
- /dashboard shows the current balance, recent activity, and quick links.
- The layout is designed for a realistic banking demo with recent transactions and account summary cards.

### Balance
- /balance displays the current account balance and recent activity context.
- It is useful before submitting a transfer.

### Transfer money
- Open /transfer to send money to another registered user.
- Required fields include recipient email, amount, category, and an optional note.
- The transfer flow now sends country metadata to the backend so the demo can evaluate whether the transaction should be treated as a standard transfer or a review-worthy event.
- For non-AU/NZ transfers, the app displays a plain-language security notice before the transfer is completed.
- The backend validates the recipient, checks balance, updates records, and writes an audit log entry when necessary.

### Virtual card
- /card shows the user's virtual card details.
- If the card is missing or invalid, the app can repair or recreate it automatically.
- Card status can be managed from the card page.

### Store
- /store simulates a purchase experience using the virtual card.
- Completing a demo checkout creates a transaction that appears in the transaction history.

### Transactions
- /transactions shows the full transaction history for the signed-in user.
- The page includes pagination so longer histories are easier to browse.

### Profile
- /profile displays the current account profile, email, and role.
- It is helpful for confirming the signed-in identity and access level.

## Admin Experience

### Admin dashboard
- /admin/dashboard shows the latest flagged transactions and recent activity for the system.
- Admins can review items from both sections and use pagination to move through longer lists.

### Admin users
- /admin/users lists the available users in the system.
- This page is intended for user review and account oversight.

### Admin transactions
- /admin/transactions provides a centralized transaction review view.
- Admins can see the transaction list and clear the flagged state when a review is complete.

## Hidden API Docs
- The API documentation page is intentionally hidden from the main navigation.
- It is available directly at /api-docs for developers and auditors.

## Troubleshooting

### Common issues
- Refresh the page if backend requests fail unexpectedly.
- Make sure the user is signed in before opening protected pages.
- Verify that the backend and frontend both have the correct environment values.

### Transfer issues
- Confirm the recipient email belongs to a registered user.
- Confirm that the sender has enough funds.
- Review the security notice if the transfer is outside the normal region.

### Card issues
- Ensure that the backend is reachable and the user is authenticated.
- The app will regenerate or repair the card when needed.

## Additional Resources
- frontend/README.md
- backend/README.md
- PROJECT_OVERVIEW.md
