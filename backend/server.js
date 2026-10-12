// Natuf franchise landing page server.
// Serves the frontend, exposes config.js with live settings, and receives leads at POST /api/leads.

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const { validateLead } = require("./src/validateLead");
const { saveLead } = require("./src/saveLead");

const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_DIR = path.resolve(__dirname, process.env.FRONTEND_DIR || "../frontend");
const META_PIXEL_ID = (process.env.META_PIXEL_ID || "").trim();
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",").map(function (o) { return o.trim(); }).filter(Boolean);

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1); // behind Nginx: use the real client IP for rate limiting

// Only needed when the page is hosted on another domain and posts here
app.use("/api", function (req, res, next) {
  const origin = req.get("origin");
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "10kb" }));

// Simple per-IP limit so the form cannot be flooded: 10 submissions per 10 minutes
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const entry = hits.get(req.ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(req.ip, { start: now, count: 1 });
    return next();
  }
  entry.count += 1;
  if (entry.count > MAX_PER_WINDOW) {
    return res.status(429).json({ ok: false, error: "Too many submissions. Please try again later." });
  }
  next();
}
setInterval(function () {
  const now = Date.now();
  hits.forEach(function (entry, ip) { if (now - entry.start > WINDOW_MS) hits.delete(ip); });
}, WINDOW_MS).unref();

app.get("/api/health", function (req, res) {
  res.json({ ok: true });
});

app.post("/api/leads", rateLimit, async function (req, res) {
  const result = validateLead(req.body);
  if (result.errors) {
    return res.status(400).json({ ok: false, error: "Invalid fields", fields: result.errors });
  }
  try {
    await saveLead(result.lead);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("Failed to save lead:", err);
    res.status(500).json({ ok: false, error: "Could not save your details. Please try again." });
  }
});

// When served from here, the page posts to this backend and gets the Pixel ID from .env
app.get("/config.js", function (req, res) {
  const config = { formEndpoint: "/api/leads", metaPixelId: META_PIXEL_ID };
  res.type("application/javascript");
  res.set("Cache-Control", "no-store");
  res.send("window.NATUF_CONFIG = " + JSON.stringify(config) + ";\n");
});

app.use(express.static(FRONTEND_DIR, { extensions: ["html"], maxAge: "1h" }));

app.use(function (req, res) {
  res.status(404).sendFile(path.join(FRONTEND_DIR, "index.html"));
});

app.listen(PORT, function () {
  console.log("Natuf landing page running on http://localhost:" + PORT);
  console.log("Serving frontend from " + FRONTEND_DIR);
});
