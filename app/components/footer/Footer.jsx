// app/components/SiteFooter.jsx

import { getUpdatedFooter } from "@/app/lib/footer";
import FooterClient from "./FooterClient";


export default async function Footer() {
  const data = await getUpdatedFooter();
  return <FooterClient data={data} />;
}
