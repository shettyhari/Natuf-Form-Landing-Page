// Storage hook for leads.
//
// DATABASE: this is the one place to connect storage (database, CRM, Google Sheet, etc.).
// Replace the body of saveLead with the real insert. It receives an already
// validated lead and should throw if saving fails, so the visitor sees an error
// and can retry instead of the lead being lost silently.

async function saveLead(lead) {
  const record = { ...lead, createdAt: new Date().toISOString() };

  // TODO(database): persist `record`. Until then leads are only written to the server log.
  console.log("[lead]", JSON.stringify(record));

  return record;
}

module.exports = { saveLead };
