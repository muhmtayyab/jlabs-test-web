# JLab - IP Geolocation Sample App

A sample web app with a Node.js API and React frontend for user authentication and IP geolocation lookup.

## Quick Start

### 1. Web (React)

```bash
cd web
npm install
npm run dev       # Runs at http://localhost:5173
```

### 2. Login

- Email: `user@example.com`
- Password: `password123`

(Or `admin@example.com` / `admin123`)

## Features

- **Login**: Email/password validation against database
- **Home**: IP & geolocation info for logged-in user
- **Search**: Enter any IP to see its geolocation
- **Validation**: Error for invalid IP format
- **Clear**: Reset to current user's location
- **History**: List of recent IP searches

## Tech Stack

- **Web**: React 18, Vite, React Router
- **Geo**: ipinfo.io (free tier)
