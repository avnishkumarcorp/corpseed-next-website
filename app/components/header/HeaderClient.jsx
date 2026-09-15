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
import { Search, X } from "lucide-react";
// ✅ Lazy load heavy overlays (performance win)
const SearchPanel = dynamic(() => import("./SearchPanel"), { ssr: false });
const MobileDrawer = dynamic(() => import("./MobileDrawer"), { ssr: false });
const HeroSearch = dynamic(() => import("../home/HeroSearch"), { ssr: false });

export default function HeaderClient({ menuData = [] }) {
  const pathname = usePathname();
  const menuMap = useMemo(() => buildMenuMap(menuData), [menuData]);
  const [openKey, setOpenKey] = useState(null);
  const closeTimerRef = useRef(null);

  const [allOpen, setAllOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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

  useEffect(() => {
    // 🔥 Close all dropdowns when route changes
    setOpenKey(null);
    setAllOpen(false);
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
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

            <div className="ml-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Search
              </button>

              <div className="ml-6 flex items-center gap-4">
                <div
                  className="relative"
                  onMouseEnter={openAll}
                  onMouseLeave={closeAll}
                >
                  <button className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 cursor-pointer">
                    All Corpseed
                  </button>

                  <div onMouseEnter={openAll} onMouseLeave={closeAll}>
                    <AllCorpseedDropdown open={allOpen} menuMap={menuMap} />
                  </div>
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

          {/* Mobile button */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-[#212529] hover:bg-slate-50 cursor-pointer"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center justify-center text-xl rounded-lg px-3 py-2 text-[#212529] hover:bg-slate-50 cursor-pointer"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Desktop search overlay (lazy loaded) */}
      {searchOpen ? (
        <SearchPanel
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          topOffset={72}
        />
      ) : null}

      {mobileSearchOpen ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <span className="text-sm font-semibold text-slate-700">Search</span>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 cursor-pointer"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <HeroSearch
              baseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
              placeholders={[
                "Search 500+ services - try “EPR For Plastic Waste”…",
                "Search 500+ services - try “BIS Certification”…",
                "Search 500+ services - try “Pollution NOC”…",
                "Search 500+ services - try “IMEI Number”…",
              ]}
            />
          </div>
        </div>
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
