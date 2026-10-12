// Server-side checks for a lead. Mirrors the rules in the frontend form,
// because the browser checks can be skipped by anyone posting directly.

const FORMATS = [
  "Kiosk (100–200 sft) · ₹35L",
  "Express Cafe (200–500 sft) · ₹55L",
  "Flagship Cafe (500–800 sft) · ₹85L",
  "Signature Cafe (800–1500 sft) · ₹1.25 Cr",
  "Not sure yet"
];
const TIMELINES = ["Immediately", "Within 3 months", "3–6 months", "6+ months"];
const BACKGROUNDS = [
  "Business owner",
  "F&B / restaurant industry",
  "Working professional",
  "Existing franchise partner",
  "Other"
];

const PHONE_RE = /^[+0-9\s-]{10,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Returns { lead } when valid, or { errors } listing the bad fields.
function validateLead(body) {
  const input = body && typeof body === "object" ? body : {};
  const lead = {
    name: text(input.name, 120),
    phone: text(input.phone, 20),
    email: text(input.email, 160).toLowerCase(),
    city: text(input.city, 120),
    format: text(input.format, 80),
    timeline: text(input.timeline, 40),
    background: text(input.background, 60),
    source: text(input.source, 120),
    page: text(input.page, 500)
  };

  const errors = [];
  if (!lead.name) errors.push("name");
  if (!PHONE_RE.test(lead.phone)) errors.push("phone");
  if (!EMAIL_RE.test(lead.email)) errors.push("email");
  if (!lead.city) errors.push("city");
  if (!FORMATS.includes(lead.format)) errors.push("format");
  if (!TIMELINES.includes(lead.timeline)) errors.push("timeline");
  if (!BACKGROUNDS.includes(lead.background)) errors.push("background");

  return errors.length ? { errors } : { lead };
}

module.exports = { validateLead };
