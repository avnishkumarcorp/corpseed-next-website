/** Announces a successfully verified enquiry to Google Tag Manager. */
export function trackVerifiedLead() {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "corpseed_lead_created" });
}
