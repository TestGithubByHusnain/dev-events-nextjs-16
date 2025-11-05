"use client";

import posthog from "posthog-js";

// Only initialize when key exists to avoid noisy errors in dev
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (typeof window !== "undefined" && KEY) {
  // Silence AbortError noise from fetch cancellations (HMR / route changes)
  window.addEventListener("unhandledrejection", (e) => {
    const reason = (e as PromiseRejectionEvent).reason;
    const msg = typeof reason === "string" ? reason : reason?.message || "";
    if (reason?.name === "AbortError" || msg.includes("aborted without reason")) {
      e.preventDefault();
    }
  });

  posthog.init(KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    capture_pageview: true,
    capture_exceptions: true,
    autocapture: true,
    debug: false,
  });
}
