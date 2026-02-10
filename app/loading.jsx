import Image from "next/image";
import logo from './assets/CORPSEED.webp'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

      {/* Loader */}
      <div className="relative grid place-items-center">
        {/* Spinning ring */}
        <div className="h-28 w-28 animate-spin rounded-full border-4 border-white/30 border-t-white shadow-lg" />

        {/* Logo in center */}
        <div className="absolute grid place-items-center">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-white shadow-xl">
            <Image
              src={logo} // ✅ change to your file name in /public
              alt="Company Logo"
              width={80}
              height={80}
              className="h-full w-full object-contain p-2"
              priority
            />
          </div>
        </div>

        {/* Optional text */}
        <p className="mt-5 text-sm font-medium text-white/90">
          Loading...
        </p>
      </div>
    </div>
  );
}
