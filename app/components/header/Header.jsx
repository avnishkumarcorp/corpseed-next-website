import Link from "next/link";
import { Menu } from "lucide-react";
import logo from "../../assets/CORPSEED.webp";
import Image from "next/image";

const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold cursor-pointer">
          <Image
            src={logo}
            alt="Corpseed"
            width={140}
            height={40}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-gray-700 hover:text-black cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm md:hidden cursor-pointer"
          type="button"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
