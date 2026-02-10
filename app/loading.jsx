import Image from "next/image";
import logo from "./assets/CORPSEED.webp";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

      {/* Loader wrapper */}
      <div className="relative flex flex-col items-center">
        {/* Ring + logo container */}
        <div className="relative h-28 w-28">
          {/* Spinning ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-white/30 border-t-white shadow-lg" />

          {/* Centered logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-white shadow-xl">
              <Image
                src={logo}
                alt="Company Logo"
                width={80}
                height={80}
                priority
                className="h-full w-full object-contain p-2"
              />
            </div>
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
