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

## B. Static hosting (Vercel, Netlify, S3) for the frontend only

1. Deploy the `frontend/` folder as a static site.
2. In `frontend/config.js` set `formEndpoint` to the full URL of a running backend,
   e.g. `https://api.your-domain.com/api/leads`, and set `metaPixelId`.
3. On that backend, add the static site's domain to `ALLOWED_ORIGINS` in `.env`.

If `formEndpoint` is empty, the thank-you screen still shows but **no lead is sent**.

## Storing leads

Leads are validated and passed to `backend/src/saveLead.js`. Until the database is
connected there, they are only written to the server log (`pm2 logs natuf-landing`).
