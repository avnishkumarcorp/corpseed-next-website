/**
 * Route-change loading UI.
 *
 * Two things matter here:
 *
 * 1. This file existing at all is what makes a click feel instant. The Next
 *    router renders it on the client the moment a <Link> is activated, before
 *    any server round trip, so the URL and the view change immediately. Delete
 *    it and every navigation blocks on the server response with the old page
 *    still on screen — which reads as "the button did nothing".
 *
 * 2. It replaces the page content, so it has to look like a page loading. It
 *    was a full-screen dark blur with a big spinner (hides everything, feels
 *    like a freeze); a bare progress bar was the opposite mistake and left the
 *    content area blank. A skeleton that echoes the real layout is what reads
 *    as progress.
 *
 * The site header and footer live in the layout, outside this boundary, so
 * they stay put throughout.
 */
export default function Loading() {
  return (
    <>
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-0 z-[10000]"
      >
        <span className="cs-sr-only">Loading page…</span>

        <div className="h-[3px] w-full overflow-hidden bg-blue-100/70">
          <div className="cs-route-progress h-full w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500" />
        </div>
      </div>

      <div aria-hidden="true" className="cs-container py-12 md:py-16">
        {/* Heading block */}
        <div className="cs-skeleton h-3 w-28 rounded-full" />
        <div className="cs-skeleton mt-4 h-9 w-[min(28rem,85%)] rounded-lg" />
        <div className="cs-skeleton mt-3 h-4 w-[min(38rem,95%)] rounded" />
        <div className="cs-skeleton mt-2 h-4 w-[min(30rem,80%)] rounded" />

        {/* Card grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="cs-skeleton h-32 w-full rounded-xl" />
              <div className="cs-skeleton mt-4 h-4 w-4/5 rounded" />
              <div className="cs-skeleton mt-2.5 h-3 w-full rounded" />
              <div className="cs-skeleton mt-2 h-3 w-3/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
