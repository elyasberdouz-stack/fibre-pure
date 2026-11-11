"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * The Daisy sections read the window size in their first render to choose the desktop or mobile layout.
 * HTML pre-rendered on the server can't know that size, so on phones it would not match what the browser
 * renders (React hydration errors #418 / #423). Rendering the page in the browser only avoids that.
 */
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : null;
}
