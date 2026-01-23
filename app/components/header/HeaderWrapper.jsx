"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import { getHeaderMenu } from "@/app/lib/menu";

export default function HeaderWrapper() {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const data = await getHeaderMenu();

      console.log("dfkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjs",data)
      if (alive) {
        setMenuData(data);
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return <Header menuData={menuData} loading={loading} />;
}
