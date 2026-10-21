/* The explainer film on the System pages (owner, 2026-10-22: "track who watches the video more than 15 seconds").
   Counts real watching time (seeking ahead doesn't count) and sends one standard ViewContent at 15 s, once per
   page view, so Meta can build "watched the film, didn't book" audiences. Standard, not custom: the event is
   counted without verifying the domain. */
(() => {
  const video = document.querySelector('.sy-film-video');
  if (!video) return;
  const AFTER = 15;
  let watched = 0;
  let last = null;
  let sent = false;
  video.addEventListener('timeupdate', () => {
    const t = video.currentTime;
    if (last !== null) {
      const step = t - last;
      if (step > 0 && step < 1.5) watched += step; // a jump (seek) is not watching
    }
    last = t;
    if (!sent && watched >= AFTER) {
      sent = true;
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', { content_name: 'system film 15s', content_category: document.documentElement.lang || 'en' });
      }
    }
  });
  video.addEventListener('seeking', () => { last = null; });
})();
