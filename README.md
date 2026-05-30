# Crystal Boat Tours — NestJS + React

A fast, responsive rebuild of [crystalboattours.com](https://crystalboattours.com/) using a
**NestJS** API backend and a **React (Vite + TypeScript + Tailwind)** frontend.

Boat tours & water-sports in the Bay of Lalzi, Albania — with online booking where the
visitor pays a **20% deposit via PayPal**.

## Structure

```
cbtNew/
├── backend/    NestJS API (tours, bookings + PayPal, contact, newsletter)
└── frontend/   React SPA (responsive, mobile-first)
```

## Quick start

```bash
# from the repo root
npm install            # installs both workspaces
npm run dev            # runs API (http://localhost:3001) + web (http://localhost:5173)
```

The frontend dev server proxies `/api` → the backend automatically.

## PayPal setup

Bookings take a **20% deposit**. Configure credentials in `backend/.env`
(see `backend/.env.example`) and the client id in `frontend/.env`
(see `frontend/.env.example`). Without keys the app runs in a safe **mock** mode so
you can develop the whole flow without a PayPal account.

## Admin panel

A password-protected dashboard lives at **`/admin`** (login at `/admin/login`).
It shows bookings, contact messages, newsletter subscribers and a summary
(deposits collected, expected revenue), and can export subscribers to CSV.

Configure credentials in `backend/.env`:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<a strong password>
JWT_SECRET=<long random string, e.g. `openssl rand -hex 48`>
```

Login returns a JWT (valid 8h) that authorises the read-only `/api/admin/*`
endpoints. **The admin panel requires the NestJS backend to be running** — it does
not work on a static-only deployment (e.g. Netlify), where there is no API.

## Build for production

```bash
npm run build
npm start               # serves the built frontend + API from the NestJS server
```
