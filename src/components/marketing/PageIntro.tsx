"use client";

import { useEffect, useState } from "react";

/**
 * First-paint full-screen intro. Black background, brand mark fades in,
 * then two coloured panels wipe off vertically. Shows once per session.
 * Honours prefers-reduced-motion (skipped via CSS @media).
 */
export function PageIntro() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const SESSION_KEY = "restorise:intro:played";
    if (window.sessionStorage.getItem(SESSION_KEY)) {
      setShow(false);
      return;
    }
    const t = window.setTimeout(() => {
      setShow(false);
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }, 1400);
    return () => window.clearTimeout(t);
  }, []);

  if (!mounted || !show) return null;

  return (
    <div className="page-intro" aria-hidden="true">
      <p className="page-intro__mark">
        Resto<span>rise</span>
      </p>
      <span className="page-intro__line" />
    </div>
  );
}
