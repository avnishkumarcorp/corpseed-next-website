// app/components/clients/ClientsMarquee.jsx
import { getClients } from "@/app/lib/clients";
import LogoMarquee from "../carousel/LogoMarquee";

export default async function ClientsMarquee({ speed = 60 }) {
  const clients = await getClients();

  return (
    <section className="mx-auto max-w-full px-4 bg-white">
      <LogoMarquee speed={speed} items={clients} />
    </section>
  );
}
