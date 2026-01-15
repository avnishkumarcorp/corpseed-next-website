import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold">Corpseed</p>
            <p className="mt-1 text-sm text-gray-600">
              © {new Date().getFullYear()} Corpseed. All rights reserved.
            </p>
          </div>

          <div className="flex gap-5 text-sm">
            <Link href="/privacy" className="text-gray-700 hover:text-black cursor-pointer">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-700 hover:text-black cursor-pointer">
              Terms
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black cursor-pointer">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
