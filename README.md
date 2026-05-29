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

## Build for production

```bash
npm run build
npm start               # serves the built frontend from the NestJS server
```
