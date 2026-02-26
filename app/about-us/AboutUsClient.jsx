"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, MessageCircle, Shield, ArrowRight } from "lucide-react";
import TalkToExpertCard from "../service/TalkToExpertCard";
import ConsultNowModal from "../components/ConsultNowModal";
import beginFrom from "../assets/begin-from.webp";
import ceo from "../assets/ceo.webp";
import sustainability from "../assets/Sustainability-02.png";
import environmental from "../assets/Environmental_main_image-03.png";

function Section({ children, className = "" }) {
  return (
    <section className={`py-10 md:py-14 lg:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">{children}</div>
    </section>
  );
}

const AboutUsClient = () => {
  const [consultOpen, setConsultOpen] = useState(false);
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[58vh] min-h-[420px] md:h-[62vh] lg:h-[78vh] lg:min-h-[640px]">
          <Image
            src={beginFrom}
            alt="About Us Hero"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            style={{ objectPosition: "50% 15%" }} // keeps faces visible
          />

          {/* Premium overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-7xl px-6 w-full">
              <div className="max-w-3xl">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 !text-white/90 text-sm backdrop-blur">
                  Corpseed <span className="opacity-70">•</span> About
                </p>

                <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-bold !text-white leading-[1.05] tracking-tight">
                  About Us
                </h1>

                <p className="mt-4 !text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
                  At Corpseed, we believe in simplifying business compliance
                  through innovative AI-driven solutions.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {/* <TalkToExpertCard
                    isAboutUs={true}
                    onClick={() => setConsultOpen(true)}
                  /> */}
                  <Link
                    href="#begin"
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 !text-white font-semibold transition cursor-pointer backdrop-blur inline-flex items-center gap-2"
                  >
                    Explore <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* subtle divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </section>

      {/* OUR STORY */}
      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Story
            </h2>
            <p className="mt-4 text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl">
              At Corpseed, we believe in simplifying business compliance through
              innovative AI-driven solutions. Our platform helps organizations
              navigate complex regulatory requirements with ease and confidence.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-gray-300 bg-slate-50 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white border border-gray-300 p-4">
                  <p className="text-sm text-gray-500">Focus</p>
                  <p className="mt-1 font-semibold text-gray-900">Compliance</p>
                </div>
                <div className="rounded-xl bg-white border border-gray-300 p-4">
                  <p className="text-sm text-gray-500">Approach</p>
                  <p className="mt-1 font-semibold text-gray-900">AI-driven</p>
                </div>
                <div className="rounded-xl bg-white border border-gray-300 p-4">
                  <p className="text-sm text-gray-500">Customers</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    SMEs + Enterprise
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-gray-300 p-4">
                  <p className="text-sm text-gray-500">Value</p>
                  <p className="mt-1 font-semibold text-gray-900">Trust</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CEO LETTER */}
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[520px] lg:h-[560px]">
          <Image
            src={ceo}
            alt="CEO Letter Background"
            fill
            className="object-cover"
            sizes="100vw"
            style={{ objectPosition: "50% 20%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/20" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-7xl px-6 w-full">
              <div className="max-w-3xl text-white">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight !text-white">
                  A letter from our <br /> CEO
                </h2>

                <p className="mt-4 !text-white/90 text-sm sm:text-base md:text-lg leading-relaxed">
                  Read about how the Corpseed team is committed to empowering
                  startups, SMEs, and enterprises through technology-driven
                  compliance solutions. Our mission is to simplify complex
                  regulatory processes and enable businesses to move forward
                  with confidence, transparency, and trust—every step of the
                  way.
                </p>

                {/* <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer">
                  Read CEO letter
                </button> */}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </section>

      {/* WHO WE ARE */}
      <Section className="bg-slate-50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Who We Are
            </h3>

            <p className="mt-4 text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
              Through helping Indian startups & businesses mitigate regulatory
              compliance risks through robust processes and AI-driven
              proprietary technology, we simplify business compliance whilst
              protecting the confidentiality and privacy of our customers. This
              enables our clients to save time and money, which can drive
              positive, sustainable change for our clients, our people and
              society at large.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
              <div className="relative w-full h-[260px] md:h-[340px] rounded-xl overflow-hidden">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX6K2VXY9f58PTYSFtu3_xPykBnZ_XIYI-WA&s"
                  alt="Who We Are"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* WHAT WE STAND FOR */}
      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-2xl border border-gray-300 bg-slate-50 p-6 shadow-sm">
              <div className="relative w-full h-[260px] md:h-[340px] rounded-xl overflow-hidden">
                <Image
                  src={sustainability}
                  alt="What We Stand For"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
              What We Stand For
            </h3>

            <p className="mt-4 text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
              At Corpseed, we encourage and empower change in all we do. Every
              single day, we challenge ourselves to bring our absolute best to
              clients, to the public and to one another. We set ourselves apart
              through our affection and pride, our expertise and our eagerness,
              our inclusive culture and our focus on developing the leaders of
              tomorrow.
            </p>
          </div>
        </div>
      </Section>

      {/* MISSION */}
      <Section className="bg-slate-50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5">
            <div className="h-full rounded-2xl p-10 bg-gradient-to-br from-blue-600 to-blue-500 !text-white shadow-sm">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug !text-white">
                Our Mission <br />
                Simplify Business <br />
                Compliance
              </h2>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Our Mission
            </h3>

            <p className="mt-4 text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
              At Corpseed, our mission is to simplify business compliance
              through technology-driven solutions. We aim to empower startups,
              SMEs, and enterprises by making regulatory processes transparent,
              efficient, and accessible—so businesses can focus on growth while
              we handle compliance.
            </p>
          </div>
        </div>
      </Section>

      {/* VISION */}
      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5">
            <div className="h-full rounded-2xl p-10 bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-sm">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug !text-white">
                Our Vision <br />
                Simplify Business <br />
                Compliance
              </h2>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Our Vision
            </h3>

            <p className="mt-4 text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
              Our vision is to become the most trusted technology-driven
              compliance partner for businesses worldwide. We aim to simplify
              complex regulatory processes, enable sustainable growth, and
              empower startups, SMEs, and enterprises to operate with confidence
              in an ever-evolving regulatory landscape.
            </p>
          </div>
        </div>
      </Section>

      {/* WHERE WE BEGIN FROM */}
      <Section className="bg-slate-50">
        <div id="begin" />
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h2 className="text-3xl md:text-5xl font-semibold text-gray-900">
            Where We Begin From
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-300 shadow-sm hover:shadow-md transition">
            <div className="relative w-full h-[240px] md:h-[320px]">
              <Image
                src={beginFrom}
                alt="A Startup in 2017"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectPosition: "50% 20%" }}
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">A Startup in 2017</h3>

              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
                A small team working out of a modest space in Delhi began its
                journey with big ambitions. We started by offering services such
                as startup business planning for funding, company incorporation,
                and intellectual property solutions. In our very first year, our
                services were trusted and appreciated by over 9,000 businesses.
              </p>

              {/* <Link
                href="#"
                className="text-blue-700 hover:text-blue-900 underline text-sm font-medium cursor-pointer"
              >
                See our leadership
              </Link> */}
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-gray-300 shadow-sm hover:shadow-md transition">
            <div className="relative w-full h-[240px] md:h-[320px]">
              <Image
                src={ceo}
                alt="From CEO Desk"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectPosition: "50% 20%" }}
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">From CEO Desk</h3>

              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
                At Corpseed, our purpose is to build a stronger compliance
                ecosystem, inspire confidence, and empower positive change in
                your business. The insights and quality-driven services we
                deliver help build trust and confidence in managing regulatory
                compliance effectively.
              </p>

              {/* <Link
                href="#"
                className="text-blue-700 hover:text-blue-900 underline text-sm font-medium cursor-pointer"
              >
                Learn more
              </Link> */}
            </div>
          </div>
        </div>
      </Section>

      {/* RESOURCES */}
      <Section className="bg-white">
        <h2 className="text-3xl md:text-5xl font-semibold text-gray-900">
          Resources to Help You Succeed
        </h2>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-gray-300 bg-slate-50 p-7 hover:bg-slate-100 transition">
            <FileText className="w-10 h-10 mb-4 text-blue-700" />
            <h3 className="text-xl font-semibold mb-2">
              Licensing & Registration
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Get expert assistance with business licensing, company
              registration, and all compliance documentation.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-300 bg-slate-50 p-7 hover:bg-slate-100 transition">
            <MessageCircle className="w-10 h-10 mb-4 text-blue-700" />
            <h3 className="text-xl font-semibold mb-2">
              Compliance Consulting
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Get personalized compliance advice and expert guidance to navigate
              regulatory requirements effectively.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-300 bg-slate-50 p-7 hover:bg-slate-100 transition">
            <Shield className="w-10 h-10 mb-4 text-blue-700" />
            <h3 className="text-xl font-semibold mb-2">Compliance Resources</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Access guides, checklists, and tools to simplify your compliance
              journey and ensure regulatory adherence.
            </p>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-slate-50">
        <div className="rounded-3xl border border-gray-300 bg-gradient-to-br from-black to-gray-900 text-white p-10 md:p-14">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="text-3xl mb-2 md:text-4xl lg:text-5xl font-semibold leading-tight !text-white">
                Join Our Compliance <br /> Experts Team
              </h2>

              <Link
                href={"/join-our-team"}
                className="mt-6 !bg-white text-black px-7 py-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition cursor-pointer"
              >
                View Career Opportunities
              </Link>
            </div>

            <div className="flex justify-center w-full lg:w-1/2">
              <Image
                src={environmental}
                alt="Join our team"
                width={460}
                height={460}
                className="w-[220px] md:w-[420px] h-auto drop-shadow"
              />
            </div>
          </div>
        </div>
      </Section>
      {/* <ConsultNowModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        title="Consult Now"
        
      /> */}
    </main>
  );
};

export default AboutUsClient;
