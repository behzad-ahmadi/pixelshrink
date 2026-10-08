/**
 * Analytics stub. trackEvent is a no-op until a GA measurement ID is set
 * via NEXT_PUBLIC_GA_ID. No cookies, no fingerprinting, no third-party
 * requests ship with the MVP.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number>,
): void {
  if (!GA_ID) return;
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params ?? {});
  }
}

export function isAnalyticsEnabled(): boolean {
  return Boolean(GA_ID);
}
