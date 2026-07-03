# SecureBank Backend

Simple Node.js Express server for SecureBank application.

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or pnpm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will be available at `http://localhost:5000`

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## Project Structure

```
backend/
├── server.js      # Main server file
├── .env           # Environment variables
├── package.json   # Project dependencies
└── node_modules/  # Dependencies directory
```
