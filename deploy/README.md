# Deploying the Natuf landing page

Two ways to run it. Pick one.

## A. Node server (frontend + backend together), recommended

Leads are posted to this server at `/api/leads`.

1. On your machine: `npm run build`. This refreshes `release/frontend` and `release/backend`.
2. Upload the `release/` and `deploy/` folders to the server (e.g. `/var/www/natuf`).
3. On the server:
   ```bash
   cd /var/www/natuf/release/backend
   npm install --omit=dev
   cp .env.example .env   # then set META_PIXEL_ID
   pm2 start /var/www/natuf/deploy/ecosystem.config.js
   pm2 save && pm2 startup
   ```
4. Set up Nginx with [`nginx.conf`](nginx.conf) (change the domain), then add HTTPS with Certbot.
5. Check: `curl https://your-domain/api/health` should return `{"ok":true}`.

## B. Vercel

Already set up: [`vercel.json`](../vercel.json) serves `frontend/`, and [`api/leads.js`](../api/leads.js)
handles `POST /api/leads` as a Vercel function using the same checks and storage hook as the backend.

1. Import the GitHub repo in Vercel. Leave Root Directory as the repo root and Framework as "Other".
2. Set `metaPixelId` in `frontend/config.js` and push.
3. Leads appear in Vercel → Project → Logs until the database is connected.

Note: the per-IP rate limit only runs on the Node server, not on Vercel.

## Storing leads

Leads are validated and passed to `backend/src/saveLead.js`. Until the database is
connected there, they are only written to the server log (`pm2 logs natuf-landing`).
