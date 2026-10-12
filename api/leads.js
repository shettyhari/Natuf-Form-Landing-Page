// Vercel serverless version of POST /api/leads.
// Uses the same validation and storage hook as the Node backend (backend/src).

const { validateLead } = require("../backend/src/validateLead");
const { saveLead } = require("../backend/src/saveLead");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

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
};
