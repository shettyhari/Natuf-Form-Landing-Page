// Page settings. Edit these two values; nothing else in the page needs to change.
window.NATUF_CONFIG = {
  // Full URL that receives lead submissions (POST, JSON), e.g. "https://api.example.com/api/leads".
  // "/api/leads" works on Vercel (api/leads.js) and on the Node backend. Set "" to send leads nowhere.
  // When the page is served by our own backend (npm start), the backend overrides this with "/api/leads".
  formEndpoint: "/api/leads",

  // Meta Pixel ID, to track PageView + Lead events for the ads.
  metaPixelId: ""
};
