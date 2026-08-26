import { getClients } from "@/app/lib/clients";
import LogoMarquee from "../carousel/LogoMarquee";

/**
 * The API returns 100+ clients. Rendering them all meant ~226 <img> elements
 * on the homepage (the track is duplicated for the seamless loop) and a loop
 * so long nobody ever saw the end of it. A representative slice reads exactly
 * the same and costs a fraction of the bandwidth.
 */
const MAX_LOGOS = 40;

export default async function ClientsMarquee({ speed }) {
  const all = await getClients();

  if (!Array.isArray(all) || !all.length) return null;

  const clients = all.slice(0, MAX_LOGOS);

  return (
    <section aria-label="Clients who trust Corpseed" className="w-full bg-white">
      <div className="cs-container py-8 md:py-10">
        <p className="text-center text-[12px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Trusted by teams across India
        </p>

        <div className="mt-5">
          <LogoMarquee speed={speed} items={clients} />
        </div>
      </div>
    </section>
  );
}
