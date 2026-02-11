import Script from "next/script";
import Footer from "./components/footer/Footer";
import "./globals.css";
import HeaderWrapper from "./components/header/HeaderWrapper";
import WhatsAppFloat from "./components/WhatsAppFloat";
import MobileStickyFooter from "./components/mobile/MobileStickyFooter";

export const metadata = {
  title: "Corpseed",
  description: "Corpseed public website",
  metadataBase: new URL("https://corpseed.com"),
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
// ✅ If you have GA4, put it here. Example: "G-XXXXXXXXXX"
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID; // set in env or hardcode

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Permissions-Policy" content="interest-cohort=()" />
      </head>

      <body className="min-h-screen bg-white text-gray-900">
        <div className="flex min-h-screen flex-col">
          <HeaderWrapper />
          <main className="flex-1">{children}</main>
          <MobileStickyFooter />
          <Footer />
          <WhatsAppFloat
            phone="917558640644"
            message="Welcome to Corpseed. Please type your query, and we shall provide immediate assistance."
          />
        </div>

        {/* ✅ Facebook Pixel - keep as afterInteractive */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','2066838230073662');fbq('track','PageView');`}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2066838230073662&ev=PageView&noscript=1"
            alt="facebook"
          />
        </noscript>

        {/* ✅ Load gtag.js only ONCE (pick one ID for src) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID || ADS_ID}`}
          strategy="afterInteractive"
        />

        {/* ✅ Configure GA4 + Ads (no duplicate gtag.js) */}
        <Script id="gtag-init" strategy="afterInteractive">
          {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

${GA4_ID ? `gtag('config', '${GA4_ID}', { send_page_view: true });` : ""}

gtag('config', '${ADS_ID}');
window.gtag_report_conversion = function(url){
  var callback = function(){ if(typeof(url) != 'undefined'){ window.location = url; } };
  gtag('event','conversion',{'send_to':'${ADS_ID}/7K8VCM6g0bIDEKrs7P8C','event_callback':callback});
  return false;
};
          `}
        </Script>
      </body>
    </html>
  );
}
