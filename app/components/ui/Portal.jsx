"use client";

import React from "react";
import { createPortal } from "react-dom";

/**
 * Renders children into document.body once mounted on the client.
 * Lives in its own module so non-hero components can use it without
 * pulling the whole hero section into their bundle.
 */
export default function Portal({ children }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}

export { Portal };
