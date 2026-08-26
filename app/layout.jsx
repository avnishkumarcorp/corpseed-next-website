import Script from "next/script";
import Footer from "./components/footer/Footer";
import "./globals.css";
import "./design-system.css";
import HeaderWrapper from "./components/header/HeaderWrapper";
import SupportDock from "./components/SupportDock";
import MobileStickyFooter from "./components/mobile/MobileStickyFooter";
import SecurityLayer from "./components/security/SecurityLayer";

const SITE_URL = "https://www.corpseed.com";

export const metadata = {
  title: {
    default:
      "Corpseed | Regulatory, Environmental & Business Compliance in India",
    template: "%s | Corpseed",
  },
  description:
    "Corpseed helps 15,000+ businesses obtain BIS, EPR, CDSCO, FSSAI, environmental and factory licences across all 28 states — flat fees, expert-managed filings.",
  metadataBase: new URL(SITE_URL),
  applicationName: "Corpseed",
  authors: [{ name: "Corpseed ITES Pvt Ltd", url: SITE_URL }],
  creator: "Corpseed ITES Pvt Ltd",
  publisher: "Corpseed ITES Pvt Ltd",
  formatDetection: { telephone: true, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Corpseed",
    locale: "en_IN",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    site: "@corpseed",
  },
  // Served from /public so the URLs stay stable (no build hash) — Google caches
  // the favicon by URL and only re-fetches it when it recrawls the page.
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "16x16 32x32 48x48 96x96",
        type: "image/x-icon",
      },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "msvalidate.01": "6FE373E64B7D16AE4CC9FA10A4FCA067",
    "google-site-verification": "xay8w1fZXMUiEkwyejtBYvYYOCsKKki9Ha_6xg3fAog",
    "facebook-domain-verification": "f3x050wlknq32peot77xkc2eviz6z6",
  },
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const ADS_ID = "AW-804992554";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

/* --------------------------------------------------------------------------
   Structured data. Rendered inline in the server HTML rather than injected
   by next/script — crawlers read the first response, and afterInteractive
   injection is not guaranteed to be seen.
   -------------------------------------------------------------------------- */

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: "Corpseed ITES Private Limited",
  alternateName: "Corpseed",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/assets/img/logo.png`,
  },
  image: `${SITE_URL}/assets/img/logo.png`,
  description:
    "Corpseed is a platform for regulatory, environmental, sustainability, plant setup and business compliance services in India.",
  telephone: "+917558640644",
  priceRange: "$$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.5",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "40560",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "3rd Floor, A-5, Grovy Optiva, Block A, Sector 68, Noida, Basi Bahuddin Nagar, Uttar Pradesh",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201316",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.623999,
    longitude: 77.383707,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+917558640644",
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["en", "Hindi"],
    },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [
    "https://www.facebook.com/CorpseedGroup",
    "https://twitter.com/corpseed",
    "https://www.linkedin.com/company/corpseed/",
    "https://www.youtube.com/channel/UCk19GzvT2hLrGQsskedcn2w",
    "https://in.pinterest.com/corpseed/",
    "https://www.instagram.com/corpseed/",
  ],
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Corpseed",
  url: `${SITE_URL}/`,
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/category/all?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Permissions-Policy" content="interest-cohort=()" />

        {/* Warm up the third-party origins we know we will hit */}
        <link rel="preconnect" href="https://corpseed-main.s3.ap-south-1.amazonaws.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_SCHEMA),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        />
      </head>

      <body className="min-h-screen bg-white text-slate-700">
        <a href="#main-content" className="cs-skip-link">
          Skip to main content
        </a>

        <SecurityLayer />

        <div className="flex min-h-screen flex-col">
          <HeaderWrapper />

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <MobileStickyFooter />
          <Footer />
          <SupportDock />
        </div>

        {/* Analytics is deliberately lazyOnload: none of it affects what the
            user sees, so it must not compete with hydration for main-thread
            time during the interaction-readiness window. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID || ADS_ID}`}
          strategy="lazyOnload"
        />

        <Script id="gtag-init" strategy="lazyOnload">
          {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

${GA4_ID ? `gtag('config', '${GA4_ID}');` : ""}

gtag('config', '${ADS_ID}');

window.gtag_report_conversion = function(url){
  var callback = function(){ if(typeof(url) != 'undefined'){ window.location = url; } };
  gtag('event','conversion',{'send_to':'${ADS_ID}/7K8VCM6g0bIDEKrs7P8C','event_callback':callback});
  return false;
};
          `}
        </Script>

        <Script id="fb-pixel" strategy="lazyOnload">
          {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2066838230073662');
fbq('track', 'PageView');
`}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2066838230073662&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <noscript>
          <iframe
            title="Google Tag Manager"
            src="https://www.googletagmanager.com/ns.html?id=GTM-WQSBJZ4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      </body>
    </html>
  );
}
