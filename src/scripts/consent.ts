/**
 * Consent and analytics. Nothing is tracked, and the Meta Pixel is not even
 * requested, until the visitor accepts. The choice is stored locally.
 *
 * Event names match the Conversions API so a server-side sender can be added
 * later without renaming: PageView, ViewContent, Lead, Schedule.
 *
 * Usage from markup:  <a data-track="Lead">           fires on click
 * Usage from scripts: window.smTrack('Schedule')
 */
export type TrackEvent = 'PageView' | 'ViewContent' | 'Lead' | 'Schedule';
type Consent = 'granted' | 'denied';
type Fbq = ((...args: unknown[]) => void) & {
  queue: unknown[][];
  loaded?: boolean;
  version?: string;
  callMethod?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    smTrack: (event: TrackEvent, params?: Record<string, unknown>) => void;
  }
}

const STORAGE_KEY = 'sm-consent';
const banner = document.getElementById('cookie-consent');
const pixelId = banner?.dataset.pixelId ?? '';

function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

function writeConsent(value: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage blocked: the choice lasts for this page view only.
  }
}

let consent = readConsent();

function loadPixel() {
  if (!pixelId || window.fbq) return;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.append(script);

  fbq('init', pixelId);
  fbq('track', 'PageView');
}

window.smTrack = (event, params) => {
  if (consent !== 'granted' || !window.fbq) return;
  window.fbq('track', event, params);
};

function decide(value: Consent) {
  consent = value;
  writeConsent(value);
  if (banner) banner.hidden = true;
  if (value === 'granted') loadPixel();
}

if (consent === 'granted') loadPixel();
if (consent === null && banner) banner.hidden = false;

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const choice = target.closest<HTMLElement>('[data-consent]')?.dataset.consent;
  if (choice === 'granted' || choice === 'denied') return decide(choice);

  if (target.closest('[data-consent-open]') && banner) {
    banner.hidden = false;
    banner.querySelector<HTMLElement>('button')?.focus();
    return;
  }

  const tracked = target.closest<HTMLElement>('[data-track]')?.dataset.track;
  if (tracked) window.smTrack(tracked as TrackEvent);
});
