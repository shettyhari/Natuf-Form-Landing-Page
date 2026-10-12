# Natuf Franchise Landing Page

Mobile lead form for Natuf FICO (Franchise Invested, Company Operated) franchise ads.
Two steps: contact details, then capital contribution / format, timeline and background.

## Structure

```
frontend/        The page: index.html, config.js, favicon, images/
backend/         Node/Express server: serves the page, receives leads at POST /api/leads
  server.js
  src/validateLead.js   Server-side checks on every lead
  src/saveLead.js       Storage hook: connect the database here
  .env.example
api/leads.js     Vercel function for POST /api/leads (same checks as backend)
vercel.json      Vercel: serve frontend/, no build step
deploy/          Nginx config, PM2 process file, deployment steps
release/         Build output (npm run build): upload this to the server
scripts/build.js Copies frontend/ + backend/ into release/
```

## Run locally

```bash
npm install
cp backend/.env.example backend/.env
npm start
```

Open http://localhost:3000. Submitted leads are printed in the terminal.

## Settings

| Where | Setting | Purpose |
|---|---|---|
| `backend/.env` | `META_PIXEL_ID` | Meta Pixel for PageView + Lead events |
| `backend/.env` | `PORT` | Server port (default 3000) |
| `backend/.env` | `ALLOWED_ORIGINS` | Domains allowed to post leads when the page is hosted elsewhere |
| `frontend/config.js` | `formEndpoint`, `metaPixelId` | Used on Vercel. `formEndpoint` is `/api/leads` |

When the backend serves the page, it replaces `config.js` automatically, so the form posts to `/api/leads`.

## API

`POST /api/leads` (JSON)

```json
{
  "name": "…", "phone": "+91 …", "email": "…", "city": "…",
  "format": "Express Cafe (200–500 sft) · ₹55L",
  "timeline": "Within 3 months",
  "background": "Business owner",
  "source": "Natuf FICO franchise Meta ad form",
  "page": "https://…"
}
```

Responses: `201 {"ok":true}`, `400` with the invalid `fields`, `429` when rate limited, `500` if saving fails.

## Database

Not included. Connect storage in [`backend/src/saveLead.js`](backend/src/saveLead.js).

## Deploy

See [`deploy/README.md`](deploy/README.md).
