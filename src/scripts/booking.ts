/**
 * Booking: fires `Schedule` when the embedded Cal.com calendar reports a
 * completed booking. Cal.com posts messages to the parent page; we only listen
 * to its origin. Tracking itself stays behind consent (see consent.ts).
 */
const frame = document.querySelector<HTMLIFrameElement>('[data-booking-frame]');

if (frame) {
  const origin = new URL(frame.src).origin;
  let sent = false;

  window.addEventListener('message', (event) => {
    if (sent || event.origin !== origin) return;
    const type = (event.data as { type?: string } | null)?.type ?? '';
    if (/bookingSuccessful/i.test(type)) {
      sent = true;
      window.smTrack('Schedule');
    }
  });
}

export {};
