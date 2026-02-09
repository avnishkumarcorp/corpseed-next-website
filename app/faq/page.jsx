import { getFaqMeta } from "../lib/faq";
import FaqAccordion from "./FaqAccordion";

// app/faq/faqData.js

export const FAQ_DATA = {
  sections: [
    {
      title: "Services We Provide",
      items: [
        {
          id: "benefits",
          question: "Benefits of taking services from Corpseed ?",
          answer:
            "At Corpseed, we are committed to offer our services to the entrepreneurs and businesses as a very cost-effective proposition. We believe that a customer is always right and the focus of any business activity should be to serve the customer with utmost loyalty. All our services come with SLAs (Service Level Agreements) for on-time service delivery and money back guarantee to ensure high level of customer satisfaction.",
        },
        {
          id: "cashback",
          question: "What is Corpseed cashback policy?",
          answer:
            "If a customer is not satisfied with the service we provided and if he contacts our customer care helpline and files a formal complaint within 15 days of service delivery date, Corpseed would refund the entire or partial amount of Professional Fee charged for that particular service.",
        },
        {
          id: "complaints",
          question: "Process to register customer complaints?",
          answer:
            "If a customer is having issues with our service delivery process, he has various alternatives available at his disposal to register his grievance with us. He can either email his complaint at complaints@corpseed.com or he can call our 24x7 Customer Care Helpline. Also, any customer is always welcome to visit our office to lodge a complaint with the senior management.",
        },
        {
          id: "online-payment",
          question: "What is the process for online payment?",
          answer:
            "A customer can buy our services directly from our online platform, for which he need to make online payment. Once he clicks on “Apply Now”, a new window will open, a customer is required to submit the information in the respective fields and click “Make Payment”. A unique ticket number will be auto generated, the customer need to quote this number as reference for any enquiry regarding his service request.",
        },
        {
          id: "payment-secured",
          question: "Is the online payment secured?",
          answer:
            "All the monetary transactions performed on Corpseed online platform are secured with SSL System Protocol. We encrypt the customer information such as credit card and bank account details, before these are transmitted anywhere. We adhere to PCI DSS for data security standards for payment processing.",
        },
      ],
    },
  ],
};

export async function generateMetadata() {
  const data = await getFaqMeta();

  // Prefer SEO object (best practice)
  const seo = data?.seo || {};

  const title = seo.metaTitle || data?.title || "FAQ | Corpseed";

  const description =
    seo.metaDescription ||
    data?.metaDescription ||
    "Frequently Asked Questions about Corpseed services.";

  // Convert " | " separated keywords → array
  const keywords = (seo.metaKeyword || data?.metaKeyword)
    ?.split("|")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    title,
    description,
    keywords,
  };
}

export default function FaqPage() {
  return (
    <main className="bg-white">
      {/* Header like screenshot */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 pt-10 md:pt-14">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900">
              F.A.Q
            </h1>
            <p className="mt-3 text-base md:text-lg text-slate-500">
              Frequently Asked Questions
            </p>
          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
      </section>

      {/* Accordion */}
      <section className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <FaqAccordion data={FAQ_DATA} />
      </section>
    </main>
  );
}
