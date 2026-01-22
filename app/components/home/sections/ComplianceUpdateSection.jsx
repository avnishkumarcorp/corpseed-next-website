// app/components/SmarterPlatformSection.jsx
import Image from "next/image";
import complianceUpdateImg from "../../../../public/home/compliance_updates.png";

const Feature = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
      {icon}
    </div>

    <div>
      <h3 className="text-[18px] font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-xl text-[14px] leading-6 text-slate-600">
        {desc}
      </p>
    </div>
  </div>
);

export default function ComplianceUpdateSection() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-[34px] font-semibold leading-tight text-blue-600 sm:text-[40px]">
              A smarter platform for better <br className="hidden sm:block" />
              results.
            </h2>

            <div className="mt-10 space-y-10">
              <Feature
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 7v5l3 2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                }
                title="Legal built for you."
                desc="No complicated forms. No robots. Just answer some questions and we'll take care of the paperwork & compliance for you."
              />

              <Feature
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 7h16M7 12h10M10 17h4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                }
                title="CA/CS in all 28 states."
                desc="No matter where you are in the country, an independent CA/CS who knows your state's laws and business compliance is here to help."
              />

              <Feature
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 8h10M7 12h6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <rect
                      x="4"
                      y="3"
                      width="16"
                      height="18"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                }
                title="Flat-fee pricing."
                desc="Whether you use a self-guided or CA/CS-supported service, you can always count us to be upfront about pricing & financial."
              />
            </div>
          </div>

          {/* RIGHT SIDE — STATIC IMAGE ONLY */}
          <div className="relative flex justify-center lg:justify-end">
            <Image
              src={complianceUpdateImg}
              alt="Compliance updates dashboard"
              priority
              className="w-[90%] max-w-[520px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
