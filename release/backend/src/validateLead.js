// Server-side checks for a lead. Mirrors the rules in the frontend form,
// because the browser checks can be skipped by anyone posting directly.

// Multi-select questions: each must have at least one answer from its list.
const QUESTIONS = {
  profile: ["Business Owner", "Entrepreneur", "Working Professional", "F&B Professional", "Other"],
  capital: ["₹35L – ₹55L", "₹55L – ₹85L", "₹85L – ₹1.25Cr", "Need More Information"],
  timeline: ["Immediately", "Within 3 Months", "Within 6 Months", "Just Exploring"],
  reason: [
    "Start a New Business",
    "Expand My Existing Business",
    "Enter the F&B Industry",
    "Explore Franchise Opportunities",
    "Still Evaluating Options"
  ],
  next_step: [
    "Schedule Presentation",
    "Send Opportunity Deck",
    "WhatsApp Details",
    "Request a Call",
    "Need More Info"
  ]
};

const PHONE_RE = /^[+0-9\s-]{10,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Accepts a single string or an array; keeps only allowed answers, without duplicates.
// Returns null if any answer is not in the list, so tampered posts are rejected.
function choices(value, allowed) {
  const list = Array.isArray(value) ? value : value === undefined ? [] : [value];
  const picked = [];
  for (const item of list) {
    const v = text(item, 80);
    if (!allowed.includes(v)) return null;
    if (!picked.includes(v)) picked.push(v);
  }
  return picked;
}

// Returns { lead } when valid, or { errors } listing the bad fields.
function validateLead(body) {
  const input = body && typeof body === "object" ? body : {};
  const lead = {
    name: text(input.name, 120),
    phone: text(input.phone, 20),
    email: text(input.email, 160).toLowerCase(),
    city: text(input.city, 120)
  };

  const errors = [];
  if (!lead.name) errors.push("name");
  if (!PHONE_RE.test(lead.phone)) errors.push("phone");
  if (!EMAIL_RE.test(lead.email)) errors.push("email");
  if (!lead.city) errors.push("city");

  for (const key of Object.keys(QUESTIONS)) {
    const picked = choices(input[key], QUESTIONS[key]);
    if (!picked || picked.length === 0) errors.push(key);
    else lead[key] = picked;
  }

  lead.source = text(input.source, 120);
  lead.page = text(input.page, 500);

  return errors.length ? { errors } : { lead };
}

module.exports = { validateLead };
