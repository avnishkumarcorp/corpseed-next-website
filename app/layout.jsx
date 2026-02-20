import Script from "next/script";
import Footer from "./components/footer/Footer";
import "./globals.css";
import HeaderWrapper from "./components/header/HeaderWrapper";
import WhatsAppFloat from "./components/WhatsAppFloat";
import MobileStickyFooter from "./components/mobile/MobileStickyFooter";

export const metadata = {
  title: "Corpseed",
  description: "Corpseed public website",
  metadataBase: new URL("https://www.corpseed.com"),
  charset: "utf-8",
  icons: {
    icon: "/fav.png",
    apple: "/fav.png",
  },
  other: {
    "msvalidate.01": "6FE373E64B7D16AE4CC9FA10A4FCA067",
    "google-site-verification": "xay8w1fZXMUiEkwyejtBYvYYOCsKKki9Ha_6xg3fAog",
    "facebook-domain-verification": "f3x050wlknq32peot77xkc2eviz6z6",
  },
};

const ADS_ID = "AW-804992554";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID; // example: G-XXXXXXX

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Permissions-Policy" content="interest-cohort=()" />

        {/* ✅ LocalBusiness JSON-LD */}
        <Script
          id="localbusiness-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Corpseed #1 Platform for Regulatory, Environmental, Sustainability, Plant Setup & Compliance",
              alternateName: "Corpseed ITES Private Limited",
              url: "https://www.corpseed.com",
              logo: "https://www.corpseed.com/assets/img/logo.png",
              image: "https://www.corpseed.com/assets/img/logo.png",
              description:
                "Corpseed #1 Platform for Regulatory, Environmental, Sustainability, Plant Setup & Compliance",
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
                streetAddress: "2nd Floor, A-154A, A Block, Sector 63",
                addressLocality: "Noida",
                addressRegion: "Uttar Pradesh",
                postalCode: "201301",
                addressCountry: "India",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 28.623999,
                longitude: 77.383707,
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+917558640644",
                contactType: "sales",
                areaServed: "IN",
                availableLanguage: ["en", "Hindi"],
              },
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
              ],
            }),
          }}
        />

        {/* ✅ Website Search Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Corpseed",
              url: "https://www.corpseed.com/",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://www.corpseed.com/search/?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

      <body className="min-h-screen bg-white text-gray-900">
        <div className="flex min-h-screen flex-col">
          <HeaderWrapper />
          <main className="flex-1">{children}</main>
          <MobileStickyFooter />
          <Footer />
          <WhatsAppFloat
            phone="917558640644"
            message="Welcome to Corpseed. Please type your query, and we shall provide immediate assistance"
          />
        </div>

        {/* ✅ Load gtag once */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${
            GA4_ID || ADS_ID
          }`}
          strategy="afterInteractive"
        />

        {/* ✅ GA4 + Ads Setup */}
        <Script id="gtag-init" strategy="afterInteractive">
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
        {/* ✅ Facebook Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">
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
            alt="facebook-pixel"
          />
        </noscript>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WQSBJZ4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
      </body>
    </html>
  );
}
