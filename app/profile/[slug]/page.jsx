// app/author/[slug]/page.jsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Mail,
  Linkedin,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  BookOpen,
} from "lucide-react";

import SafeHtml from "@/app/components/SafeHtml";
import { getAuthorProfileBySlug } from "@/app/lib/authorProfile";



function safeText(v, fallback = "") {
  if (v == null) return fallback;
  return String(v);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return String(dateStr);
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}


function toProfilePicUrl(profilePicture) {
  const v = String(profilePicture || "").trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;

  const base =
    process.env.NEXT_PUBLIC_AUTHOR_IMAGE_BASE_URL ||
    "https://corpseed-main.s3.ap-south-1.amazonaws.com/corpseed/";

  return `${base}${v}`;
}

function SocialPills({ user }) {
  const fb = safeText(user?.facebook).trim();
  const tw = safeText(user?.twitter).trim();
  const li = safeText(user?.linkedin).trim();
  const email = safeText(user?.email).trim();

  const items = [
    {
      show: Boolean(li),
      href: li.startsWith("http") ? li : `https://www.linkedin.com/in/${li}`,
      label: "LinkedIn",
      Icon: Linkedin,
    },
    {
      show: Boolean(fb),
      href: fb.startsWith("http") ? fb : `https://www.facebook.com/${fb}`,
      label: "Facebook",
      Icon: Facebook,
    },
    {
      show: Boolean(tw),
      href: tw.startsWith("http") ? tw : `https://twitter.com/${tw}`,
      label: "Twitter",
      Icon: Twitter,
    },
    {
      show: Boolean(email),
      href: `mailto:${email}`,
      label: "Email",
      Icon: Mail,
    },
  ].filter((x) => x.show);

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target={label === "Email" ? undefined : "_blank"}
          rel={label === "Email" ? undefined : "noreferrer"}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
        >
          <Icon className="h-4 w-4" />
          {label}
        </a>
      ))}
    </div>
  );
}

function ArticleList({ articles = [], title = "Articles" }) {
  if (!articles?.length) return null;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">Latest published by this author</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/knowledge-centre/${a.slug}`}
            className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 cursor-pointer"
          >
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:underline">
                {safeText(a.title)}
              </p>
              <p className="mt-1 text-xs text-slate-500">{safeText(a.slug)}</p>
            </div>
            <span className="text-slate-400 transition group-hover:translate-x-0.5">→</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

/** SEO */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getAuthorProfileBySlug(slug);

  if (!data?.user) {
    return {
      title: "Author | Corpseed",
      description: "Explore author profile and articles on Corpseed.",
    };
  }

  const user = data.user;
  return {
    title: data?.title || user?.fullName || "Author | Corpseed",
    description: data?.metaDescription || `Read articles by ${user?.fullName || "Corpseed"}.`,
    keywords: data?.metaKeyword || undefined,
    alternates: { canonical: `/author/${slug}` },
  };
}

export default async function AuthorProfilePage({ params }) {
  const { slug } = await params;

  const apiData = await getAuthorProfileBySlug(slug);
  if (!apiData?.user) return notFound();

  const user = apiData.user;
  const articles = apiData.articles || [];

  const name = user.fullName || `${safeText(user.firstName)} ${safeText(user.lastName)}`.trim();
  const jobTitle = safeText(user.jobTitle);
  const regDate = formatDate(user.regDate);

  const avatarUrl = toProfilePicUrl(user.profilePicture);

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
            {/* Left: avatar + quick info */}
            <Card className="overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 opacity-70" />
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-[88px] w-[88px] overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={name || "Author"}
                        fill
                        className="object-cover"
                        sizes="88px"
                        priority
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-slate-900">{name}</p>
                    {jobTitle ? (
                      <p className="mt-0.5 text-sm font-semibold text-blue-600">{jobTitle}</p>
                    ) : null}
                    {regDate ? (
                      <p className="mt-1 inline-flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-4 w-4" />
                        Joined: {regDate}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 grid gap-2 text-sm text-slate-600">
                  {user?.department ? (
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {safeText(user.department)}
                      </span>
                      {apiData?.articleCount != null ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {apiData.articleCount} articles
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {user?.address ? (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                      <span className="text-sm">{safeText(user.address)}</span>
                    </div>
                  ) : null}

                  {user?.mobile ? (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <a
                        href={`tel:${safeText(user.mobile)}`}
                        className="text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                      >
                        {safeText(user.mobile)}
                      </a>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5">
                  <SocialPills user={user} />
                </div>
              </div>
            </Card>

            {/* Right: about */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">Bio</p>
                  <p className="mt-1 text-xs text-slate-500">A short introduction</p>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="prose prose-slate prose-sm max-w-none prose-p:leading-relaxed">
                    <SafeHtml html={user.aboutMe || "<p>No bio available.</p>"} />
                  </div>
                </div>
              </Card>

              <ArticleList articles={articles} title="Articles by this author" />
            </div>
          </div>

          {/* Back */}
          <div className="mt-8">
            <Link
              href="/news-room"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              ← Back
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
