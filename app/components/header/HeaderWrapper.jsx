// app/components/header/HeaderWrapper.jsx
import { getHeaderMenu } from "@/app/lib/menu";
import HeaderClient from "./HeaderClient";

export default async function HeaderWrapper() {
  const menuData = (await getHeaderMenu()) || [];
  return <HeaderClient menuData={menuData} />;
}
