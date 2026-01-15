import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Calendar,
  Tag,
  ArrowRight,
  Facebook,
  Linkedin,
  Mail,
  Share2,
  Phone,
  User,
  MessageSquare,
} from "lucide-react";

export const metadata = {
  title: "Press Release | Corpseed",
  description:
    "Read Corpseed press releases, announcements and latest news about collaborations, compliance and innovation.",
};

const categories = [
  { label: "Latest News", href: "#", count: 12 },
  { label: "Press Release", href: "#", count: 34 },
  { label: "Company Updates", href: "#", count: 18 },
];

// Replace this with your API data
const pressReleases = [
  {
    id: "1",
    badge: "PRESS RELEASE",
    title:
      "Corpseed and CII Join Forces to Revolutionize MSMEs at Groundbreaking Conference on Tech and Trade",
    excerpt:
      "Corpseed ITES Pvt. Ltd. is honoured to be the Knowledge Partner with the Confederation of Indian Industry (CII) at the much-anticipated conference on MSMEs Fueling India’s Strength...",
    date: "2025-07-16",
    href: "#",
  },
  {
    id: "2",
    badge: "PRESS RELEASE",
    title:
      "Corpseed and CII Highlight Industry’s Green Innovations at the 4th Northern Region “Green Practices Awards”",
    excerpt:
      "Gurugram, India — The Confederation of Indian Industry (CII) successfully concluded the fourth edition of the Northern Region “Green Practices Award”...",
    date: "2025-07-15",
    href: "#",
  },
  {
    id: "3",
    badge: "PRESS RELEASE",
    title:
      "Corpseed and CII Announce Strategic Collaboration to Boost Business Compliance and Innovation",
    excerpt:
      "New Delhi — Corpseed ITES Pvt. Ltd., a leading business consulting firm in India, has announced a strategic collaboration with the Confederation of Indian Industry (CII)...",
    date: "2024-08-05",
    href: "#",
  },
  {
    id: "4",
    badge: "PRESS RELEASE",
    title: "Corpseed’s New Branch Office - Gujarat",
    excerpt:
      "Surat, Gujarat — Corpseed is delighted to announce that it has opened a new branch office in Gujarat to expand its financial, environmental and legal compliance advisory platform...",
    date: "2023-07-03",
    href: "#",
  },
];

const topPress = [
  {
    id: "t1",
    title: "Corpseed’s New Branch Office - Gujarat",
    href: "#",
    thumb:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=400&q=70",
  },
  {
    id: "t2",
    title: "Strategic Collaboration to Boost Compliance",
    href: "#",
    thumb:
      "https://images.unsplash.com/photo-1523958203904-cdcb402031fd?auto=format&fit=crop&w=400&q=70",
  },
  {
    id: "t3",
    title: "Revolutionize MSMEs at Conference on Tech & Trade",
    href: "#",
    thumb:
      "https://images.unsplash.com/photo-1522071901873-411886a10004?auto=format&fit=crop&w=400&q=70",
  },
  {
    id: "t4",
    title: "Green Practices Awards — Highlights & Insights",
    href: "#",
    thumb:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=70",
  },
];

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
      {children}
    </span>
  );
}

function CardShell({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-gray-300 bg-white shadow-sm transition hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

function ShareRow() {
  // Just UI icons; wire with click handlers later
  return (
    <div className="flex items-center gap-3 text-gray-500">
      <button className="hover:text-gray-900 cursor-pointer" type="button" aria-label="Share">
        <Share2 className="h-4 w-4" />
      </button>
      <button className="hover:text-blue-600 cursor-pointer" type="button" aria-label="Facebook">
        <Facebook className="h-4 w-4" />
      </button>
      <button className="hover:text-blue-600 cursor-pointer" type="button" aria-label="LinkedIn">
        <Linkedin className="h-4 w-4" />
      </button>
      <button className="hover:text-gray-900 cursor-pointer" type="button" aria-label="Email">
        <Mail className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function PressReleasePage() {
  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gray-300">
        <div className="relative h-[260px] md:h-[320px]">
          <Image
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=2000&q=70"
            alt="Press Release banner"
            fill
            priority
            className="object-cover object-[center_30%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-blue-900/50 to-blue-950/35" />

          <div className="absolute inset-0">
            <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold tracking-widest text-white/80">
                  WWW.CORPSEED.COM
                </p>
                <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Press Release
                </h1>
                <p className="mt-3 text-sm sm:text-base text-white/85">
                  Read announcements, collaborations, and updates from Corpseed — curated for a clean,
                  fast reading experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-10 md:py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12">
          {/* LEFT: LIST */}
          <div className="lg:col-span-8 space-y-6">
            {pressReleases.map((item) => (
              <CardShell key={item.id}>
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Badge>{item.badge}</Badge>

                    <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <h2 className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
                    <Link href={item.href} className="hover:underline cursor-pointer">
                      {item.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600">
                    {item.excerpt}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
                    >
                      Read more <ArrowRight className="h-4 w-4" />
                    </Link>

                    <ShareRow />
                  </div>
                </div>
              </CardShell>
            ))}

            {/* Pagination placeholder */}
            <div className="flex items-center gap-3 pt-2">
              <button
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                type="button"
              >
                Previous
              </button>
              <button
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                type="button"
              >
                Next
              </button>
            </div>
          </div>

          {/* RIGHT: SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Search */}
            <CardShell>
              <div className="p-5">
                <p className="text-sm font-semibold text-gray-900">Search</p>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <input
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Type to search..."
                    aria-label="Search press release"
                  />
                </div>
              </div>
            </CardShell>

            {/* Categories */}
            <CardShell>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-700" />
                  <p className="text-sm font-semibold text-gray-900">Categories</p>
                </div>

                <div className="mt-4 space-y-2">
                  {categories.map((c) => (
                    <Link
                      key={c.label}
                      href={c.href}
                      className="flex items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="text-gray-800">{c.label}</span>
                      <span className="text-gray-500">{c.count}</span>
                    </Link>
                  ))}

                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline cursor-pointer"
                  >
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </CardShell>

            {/* Top press */}
            <CardShell>
              <div className="p-5">
                <p className="text-sm font-semibold text-gray-900">Top Press-Release</p>

                <div className="mt-4 space-y-4">
                  {topPress.map((p) => (
                    <Link
                      key={p.id}
                      href={p.href}
                      className="flex gap-3 rounded-xl border border-gray-300 bg-white p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="relative h-14 w-16 overflow-hidden rounded-lg border border-gray-300">
                        <Image
                          src={p.thumb}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-medium text-gray-900">{p.title}</p>
                        <p className="mt-1 text-xs text-gray-500">Read article</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </CardShell>

            {/* Schedule callback */}
            <CardShell>
              <div className="p-5">
                <p className="text-lg font-semibold text-gray-900">Schedule a call back</p>

                <form className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <input
                      className="w-full bg-transparent text-sm outline-none"
                      placeholder="Name*"
                      aria-label="Name"
                    />
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <input
                      className="w-full bg-transparent text-sm outline-none"
                      placeholder="Phone Number*"
                      aria-label="Phone"
                    />
                  </div>

                  <div className="flex items-start gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2">
                    <MessageSquare className="mt-0.5 h-4 w-4 text-gray-500" />
                    <textarea
                      className="min-h-[72px] w-full resize-none bg-transparent text-sm outline-none"
                      placeholder="Message (optional)"
                      aria-label="Message"
                    />
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
                  >
                    Submit
                  </button>

                  <p className="text-xs text-gray-500">
                    By submitting, you agree to be contacted by Corpseed.
                  </p>
                </form>
              </div>
            </CardShell>
          </aside>
        </div>
      </section>
    </div>
  );
}
