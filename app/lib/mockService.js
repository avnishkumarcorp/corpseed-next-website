export const mockServices = {
  "corporate-agent-registration-in-irdai": {
    slug: "corporate-agent-registration-in-irdai",
    name: "Corporate Agent Registration in IRDAI",
    shortDescription:
      "Get expert assistance for corporate agent registration with end-to-end compliance support.",
    badgeText: "INCLUDES FREE SUPPORT",
    ratingText: "Rated 4.9 by 74,861+ customers globally",
    videoText: "Click to Watch & Know More",

    tabs: [
      {
        id: "overview",
        title: "Overview",
        html: `
          <h2>An Overview of Corporate Agent Registration</h2>
          <p>This content comes from your text editor (HTML). Keep it same.</p>
        `,
      },
      {
        id: "checklist",
        title: "Checklist",
        html: `
          <h2>Checklist</h2>
          <ul>
            <li>Company PAN</li>
            <li>Director KYC</li>
            <li>Office Address Proof</li>
          </ul>
        `,
      },
      {
        id: "benefits",
        title: "Benefits",
        html: `
          <h2>Benefits</h2>
          <p>Benefits content from editor.</p>
        `,
      },
      {
        id: "documents",
        title: "Documents",
        html: `
          <h2>Documents Required</h2>
          <p>Documents content from editor.</p>
        `,
      },
      {
        id: "procedure",
        title: "Procedure",
        html: `
          <h2>Procedure</h2>
          <p>Procedure content from editor.</p>
        `,
      },
      {
        id: "faq",
        title: "FAQ",
        html: `
          <h2>FAQ</h2>
          <p>FAQ content from editor.</p>
        `,
      },
    ],
  },

  // fallback example for any random slug
  "jhvgjdhgdl": {
    slug: "jhvgjdhgdl",
    name: "Demo Service Page",
    shortDescription: "This is a demo service page until API is connected.",
    badgeText: "INCLUDES FREE SUPPORT",
    ratingText: "Rated 4.9 by 74,861+ customers globally",
    videoText: "Click to Watch & Know More",
    tabs: [
      { id: "overview", title: "Overview", html: "<p>Demo overview HTML…</p>" },
      { id: "faq", title: "FAQ", html: "<p>Demo FAQ HTML…</p>" },
    ],
  },
};
