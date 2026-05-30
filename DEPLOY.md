# Deploying Crystal Boat Tours (full-stack)

This deploys the **whole app as one service**: NestJS serves the built React
site *and* the `/api` endpoints from a single URL. That means the public site,
PayPal booking, booking emails and the `/admin` panel all work together — with
no CORS setup and no second deployment.

The repo is already configured (`render.yaml`). You just create the service and
paste your secrets. Takes ~10 minutes.

## Deploy to Render (recommended, free)

1. Go to <https://render.com> and sign up (use **"Sign in with GitHub"** so it
   can see the repo).
2. Click **New +  → Blueprint**.
3. Select the repository **`Elvisi22/crystalBoatTours`**. Render reads
   `render.yaml` and shows one web service called `crystal-boat-tours`.
4. Click **Apply**. Render will ask you to fill in the env vars marked as
   secrets — enter:

   | Variable | What to put |
   |---|---|
   | `ADMIN_USERNAME` | your admin login name (e.g. `admin`) |
   | `ADMIN_PASSWORD` | a strong admin password |
   | `PAYPAL_CLIENT_ID` | from your PayPal app (sandbox or live) |
   | `PAYPAL_CLIENT_SECRET` | from your PayPal app |
   | `VITE_PAYPAL_CLIENT_ID` | **same value** as `PAYPAL_CLIENT_ID` |
   | `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | your email provider's outgoing details |

   `JWT_SECRET` is generated automatically. Leave PayPal in `sandbox` until
   you've tested, then change `PAYPAL_ENV` to `live`.
5. Click **Create / Deploy**. First build takes a few minutes. When it's done
   you'll get a URL like `https://crystal-boat-tours.onrender.com` — the full
   site, booking and `/admin` all live there.

To redeploy later, just `git push` — Render rebuilds automatically.

## Things to know

- **Free tier sleeps.** After ~15 min idle the service spins down; the next
  visit takes ~30s to wake. Fine for early traffic; upgrade to a paid plan
  (or add a keep-alive ping) to remove cold starts.
- **Booking data is currently file-based and ephemeral on the free tier.**
  `bookings/contact/newsletter` are saved to JSON on disk, which resets on every
  redeploy/restart. So:
  - **Configure SMTP** — each paid booking is emailed to
    `BOOKING_NOTIFY_EMAIL`, giving you a permanent record even if the JSON resets.
  - When you're ready, ask me to switch storage to a real database (Render
    offers a free Postgres) so the admin panel history is permanent.

## Keeping the Netlify site

You can retire the Netlify site and just use the Render URL (everything works
there), **or** keep Netlify as the public face and point a custom domain at
Render for booking/admin. Simplest is to use the Render URL — later, point your
real domain `crystalboattours.com` at it.

## Alternative: Railway

Railway works the same way — create a project from the GitHub repo, set the
same env vars, build `npm install --include=dev && npm run build`, start
`npm start`. Railway gives a small persistent volume more easily if you want
durable JSON storage without a database.
