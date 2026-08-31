"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Instant click feedback for every internal navigation.
 *
 * Why this exists rather than relying on loading.jsx alone: the router can
 * only render a loading boundary once it knows the target route's tree. For a
 * dynamic route that has not been prefetched — every route in `next dev`,
 * since prefetch is production-only, and any link the user reaches before
 * prefetch runs — that means waiting for the server round trip first. The
 * result is a click with no visible response at all, so people click again
 * and again.
 *
 * This listens for the click itself, so feedback starts on the same tick the
 * user acts, independent of the router. It then clears when the route
 * actually changes.
 *
 * Deliberately a document-level capture listener rather than wrapping every
 * link: it covers Links, plain anchors and anything added later, with one
 * listener and no changes to call sites.
 */
const MAX_WAIT_MS = 20000;

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState("idle"); // idle | loading | done
  // Bumped on every start so the bar remounts and its animation restarts when
  // someone clicks a second link while the first is still in flight.
  const [runId, setRunId] = useState(0);

  const pendingLinkRef = useRef(null);
  const failsafeRef = useRef(0);
  const doneRef = useRef(0);

  const clearPendingLink = useCallback(() => {
    if (pendingLinkRef.current) {
      pendingLinkRef.current.removeAttribute("data-cs-pending");
      pendingLinkRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    window.clearTimeout(failsafeRef.current);
    clearPendingLink();
    delete document.documentElement.dataset.csNav;

    // Let the bar run to 100% before it disappears, so a fast navigation
    // still reads as "finished" instead of a flicker.
    setState((prev) => (prev === "loading" ? "done" : prev));
  }, [clearPendingLink]);

  /* ------------------------------------------------- start on click */
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return; // left click only
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return; // opening in a new tab/window
      }

      const target = event.target;
      const anchor =
        target instanceof Element ? target.closest("a[href]") : null;

      if (!anchor) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const raw = anchor.getAttribute("href") || "";
      if (!raw || raw.startsWith("#")) return;

      let url;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // tel:, mailto:, whatsapp, any other origin — the browser handles it and
      // this page is not navigating anywhere.
      if (url.origin !== window.location.origin) return;
      if (!/^https?:$/.test(url.protocol)) return;

      // Same URL, or a jump to an anchor on this page: nothing loads.
      const samePath =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;
      if (samePath) return;

      window.clearTimeout(failsafeRef.current);
      window.clearTimeout(doneRef.current);

      // Drop the dim from a previously clicked link before marking this one.
      clearPendingLink();

      anchor.setAttribute("data-cs-pending", "");
      pendingLinkRef.current = anchor;

      // Drives `cursor: progress` site-wide. A data attribute, not a class:
      // React renders <html> and would flag a className it did not produce.
      document.documentElement.dataset.csNav = "1";

      setRunId((n) => n + 1);
      setState("loading");

      // If a navigation never completes (blocked, error, offline) the bar must
      // not sit there forever.
      failsafeRef.current = window.setTimeout(stop, MAX_WAIT_MS);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [stop, clearPendingLink]);

  /* ------------------------------- stop when the route actually changes */
  useEffect(() => {
    stop();
    // pathname + query identify the committed route; when either changes the
    // new page has rendered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  /* --------------------------------------- unmount the bar after finishing */
  useEffect(() => {
    if (state !== "done") return;

    doneRef.current = window.setTimeout(() => setState("idle"), 320);
    return () => window.clearTimeout(doneRef.current);
  }, [state]);

  /* ------------------------------------------------------------- cleanup */
  useEffect(() => {
    return () => {
      window.clearTimeout(failsafeRef.current);
      window.clearTimeout(doneRef.current);
      delete document.documentElement.dataset.csNav;
    };
  }, []);

  if (state === "idle") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[10001] h-[3px] bg-blue-100/60"
    >
      <div
        key={runId}
        className={
          state === "done" ? "cs-navbar cs-navbar--done" : "cs-navbar"
        }
      />
    </div>
  );
}
