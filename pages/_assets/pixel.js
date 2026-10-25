/* Meta Pixel (Sansara Media, 29206514812289586): PageView on every page.
   Lead is sent by lead.js and motion.js once a form is saved.
   A file, not an inline script, so the Content-Security-Policy in netlify.toml can allow it
   by origin; the policy also lists connect.facebook.net and www.facebook.com for it.
   Never on a local copy (owner, 2026-10-25: "show me before, without firing any pixel"): on localhost, 127.x and
   192.168.x the page gets a silent fbq that sends nothing, so the dev server can be clicked through freely. */
if (/^(localhost|127\.|192\.168\.|\[::1\])/.test(location.hostname)) {
  window.fbq = window.fbq || function () {}; // a test may have put its own recorder here first
} else {
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '29206514812289586');
fbq('track', 'PageView');
/* A page can send one more standard event on load: <html data-pixel="Schedule"> on the booking thank-you page,
   where the calendar sends people after they book (owner, 2026-10-19: the funnel needs "Lead" and "Schedule"). */
if (document.documentElement.dataset.pixel) fbq('track', document.documentElement.dataset.pixel);
}
