// app/components/header/HeaderClient.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "../../assets/CORPSEED.webp";

import { NAV_ITEMS } from "./config";
import { buildMenuMap } from "./helpers";
import MegaPanel from "./MegaPanel";
import AllCorpseedDropdown from "./AllCorpseedDropdown";

// ✅ Lazy load heavy overlays (performance win)
const SearchPanel = dynamic(() => import("./SearchPanel"), { ssr: false });
const MobileDrawer = dynamic(() => import("./MobileDrawer"), { ssr: false });

export default function HeaderClient({ menuData = [] }) {
  const pathname = usePathname();
  const menuMap = useMemo(() => buildMenuMap(menuData), [menuData]);
  const [openKey, setOpenKey] = useState(null);
  const closeTimerRef = useRef(null);

  const [allOpen, setAllOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);
  const allCloseTimerRef = useRef(null);

  const open = (key) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setAllOpen(false); // 🔥 close All Corpseed
    setOpenKey(key);
  };

  const close = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpenKey(null), 120);
  };

  const openAll = () => {
    if (allCloseTimerRef.current) clearTimeout(allCloseTimerRef.current);
    setOpenKey(null); // 🔥 close MegaPanel
    setAllOpen(true);
  };

  const closeAll = () => {
    if (allCloseTimerRef.current) clearTimeout(allCloseTimerRef.current);
    allCloseTimerRef.current = setTimeout(() => setAllOpen(false), 120);
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // 🔥 Close all dropdowns when route changes
    setOpenKey(null);
    setAllOpen(false);
    setSearchOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Lift the sticky header off the page once it starts overlapping content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    // Deferred rather than called inline: the page can load already scrolled
    // (restored position, #anchor), and a synchronous setState in an effect
    // body triggers a cascading render.
    const initial = requestAnimationFrame(onScroll);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(initial);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow duration-200",
        scrolled ? "shadow-[0_6px_20px_-14px_rgba(15,23,42,0.6)]" : "",
      ].join(" ")}
    >
      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <Image
              src={logo}
              alt="Corpseed"
              width={140}
              height={60}
              sizes="140px"
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden items-center gap-6 lg:flex"
            onMouseLeave={close}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onMouseEnter={() => open(item.key)}
                onFocus={() => open(item.key)}
                className={[
                  "relative px-2 py-2 text-sm font-semibold cursor-pointer",
                  "text-slate-600 hover:text-slate-800",
                  "whitespace-nowrap",
                ].join(" ")}
              >
                {item.label}
                <span
                  className={[
                    "absolute left-2 right-2 -bottom-1 h-[2px] rounded-full transition-all duration-200",
                    openKey === item.key ? "bg-blue-600" : "bg-transparent",
                  ].join(" ")}
                />
              </button>
            ))}

            <div className="ml-4 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search services"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[14px] font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M21 21l-4.3-4.3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Search
              </button>

              <div
                className="relative"
                onMouseEnter={openAll}
                onMouseLeave={closeAll}
              >
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 px-3 text-[14px] font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                >
                  All Corpseed
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="m6 9 6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div onMouseEnter={openAll} onMouseLeave={closeAll}>
                  <AllCorpseedDropdown open={allOpen} menuMap={menuMap} />
                </div>
              </div>
            </div>

            <div onMouseEnter={() => open(openKey)} onMouseLeave={close}>
              <MegaPanel
                open={!!openKey}
                navKey={openKey}
                menuMap={menuMap}
                loading={false}
              />
            </div>
          </nav>

          {/* Mobile actions */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 lg:hidden">
            {/* Styled as a field rather than an icon so the search is
                discoverable. Tapping opens the same SearchPanel the desktop
                uses, which autofocuses its input — so it behaves like typing
                straight into this field. */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search services"
              className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-2 text-left transition active:bg-slate-100 sm:max-w-[260px]"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="shrink-0 text-slate-500"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M21 21l-4.3-4.3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="truncate text-[13px] text-slate-500">
                Search services
              </span>
            </button>

            <a
              href="tel:+917558640644"
              aria-label="Call Corpseed"
              className="inline-flex h-11 w-10 shrink-0 items-center justify-center rounded-lg text-blue-700 transition hover:bg-blue-50"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1l-2.2 2.2Z" />
              </svg>
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-11 w-10 shrink-0 items-center justify-center rounded-lg text-slate-800 transition hover:bg-slate-100 cursor-pointer"
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay (lazy loaded) — shared by the desktop Search button
          and the mobile search field. */}
      {searchOpen ? (
        <SearchPanel
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          topOffset={68}
        />
      ) : null}

      {/* Mobile drawer (lazy loaded) */}
      {mobileOpen ? (
        <MobileDrawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          menuMap={menuMap}
          loading={false}
          navItems={NAV_ITEMS}
        />
      ) : null}
    </header>
  );
}
