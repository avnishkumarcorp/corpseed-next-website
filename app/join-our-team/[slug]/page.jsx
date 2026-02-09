import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug } from "../../lib/career";
import JobClient from "./JobClient";

function splitKeywords(metaKeyword) {
  return (metaKeyword || "")
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { job, pageMeta } = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Not Found | Corpseed",
      description: "This job opening is not available.",
    };
  }

  const keywords = splitKeywords(pageMeta?.metaKeyword);

  // keep title strong + readable
  const title = `${job?.title || job?.position || "Job"} | Career@Corpseed`;
  const description =
    `Apply for ${job?.position || job?.title || "this role"} in ${job?.jobLocation || "Corpseed"}. ` +
    `Qualification: ${job?.qualification || "—"}, Experience: ${job?.experience || "—"}.`;

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
  };
}

export default async function JobSlugPage({ params }) {
  const { slug } = await params;
  const { job } = await getJobBySlug(slug);

  if (!job) notFound();

  return (
    <main className="bg-white">
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 pt-10 md:pt-14">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900">
              Career@<span className="text-blue-600">Corpseed</span>
            </h1>
          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <JobClient job={job} />

          <div className="px-6 pb-8 text-center">
            <Link
              href="/join-our-team"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              View all jobs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
