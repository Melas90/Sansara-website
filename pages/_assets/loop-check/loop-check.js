/*
 * The Client Loop Check (owner, 2026-10-19): a dozen questions in a pop-up, a snapshot of where the visitor's
 * path from "never heard of you" to "came back" leaks most, then their email as the gate to booking the call.
 * The owner's prototype ("The Client Loop Check.html"), set in the site's tokens; every word is in
 * check.<lang>.json beside this file.
 *
 * On a page that includes _partials/loop-check.html, every free-call button ([data-lead-open] without a topic,
 * or with the topic "The System") opens the Check instead of the short contact pop-up; buttons about another
 * offer still open the contact pop-up. The email step is sent as the site's "lead" form, so it reaches the CRM
 * like any lead and Netlify sends one notification, with the answers in it. After it, "Book my free call" opens
 * WhatsApp with the visitor's name. The owner sends the written report by hand.
 */
(() => {
  'use strict';
  const dialog = document.getElementById('loop-check');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const card = dialog.querySelector('.lc-card');
  const progress = dialog.querySelector('.lc-progress');
  const DONE = 'sansara-loop-check';
  let D = null, T = null, P = null;
  const A = {};
  let step = 0, dir = 1, opener = null;

  const fmt = (s, v = {}) => String(s).replace(/\{(\w+)\}/g, (_, k) => (v[k] ?? `{${k}}`));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const ic = (k, extra = '') => `<svg class="i ${extra}" viewBox="0 0 24 24" aria-hidden="true">${P[k] || P.other}</svg>`;
  const stageName = (k) => D.STAGE_NAME[k];
  const stageShort = (k) => { const w = stageName(k).replace(/^Be /, ''); return w.charAt(0).toUpperCase() + w.slice(1); };
  // a stage named inside a sentence keeps its name, in quotes: “Be chosen”, not “be chosen”
  const stageLower = (k) => `“${stageName(k)}”`;
  const channel = (id) => D.CHANNELS.find((c) => c.id === id);
  const track = () => { const b = A.business || []; return b.some((x) => ['inperson', 'online'].includes(x)) ? 'service' : b.some((x) => ['digital', 'physical'].includes(x)) ? 'product' : 'service'; };
  const word = (s, p) => (track() === 'product' ? T.words[p] : T.words[s]);
  const shows = (q) => !q.showIf || Object.entries(q.showIf).every(([k, vals]) => vals.includes(A[k]));

  /* ---------- open, close, the gate on the free-call buttons ---------- */
  const load = async () => {
    if (D) return;
    const res = await fetch(dialog.dataset.src);
    D = await res.json(); T = D.ui; P = D.P;
    dialog.querySelector('.lc-brand strong').textContent = T.brand;
    dialog.querySelector('.lc-brand span').textContent = T.name;
    dialog.querySelector('.lc-pills').innerHTML = D.ORDER.map((k) => `<span data-stage="${k}">${ic(k)}${esc(stageShort(k))}</span>`).join('');
  };
  const open = async (trigger) => {
    opener = trigger;
    A.__source = `${trigger?.dataset.source || 'link'} on ${location.pathname}`;
    await load();
    let done = null;
    try { done = JSON.parse(sessionStorage.getItem(DONE) || 'null'); } catch { /* storage blocked */ }
    if (done) renderReturning(done); else if (!card.innerHTML) { step = 0; render(); }
    dialog.showModal();
    document.documentElement.classList.add('lead-open');
  };
  dialog.addEventListener('close', () => { document.documentElement.classList.remove('lead-open'); opener?.focus?.(); });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.querySelector('[data-lc-close]').addEventListener('click', () => dialog.close());
  // capture phase, so the contact pop-up's own listener (lead.js) never sees these clicks
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-lead-open]');
    if (!t || (t.dataset.topic && t.dataset.topic !== 'The System')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    open(t);
  }, true);
  if (location.hash === '#lead' || location.hash === '#loop-check') {
    addEventListener('load', () => { document.getElementById('lead')?.close?.(); open(null); });
  }

  /* ---------- the learning panel ---------- */
  const panelHtml = () => `<div class="tip" hidden><div class="head"></div><p class="tip-text"></p><button type="button" class="more" hidden>${ic('chev')}<span>${esc(T.why)}</span></button><div class="detail" hidden></div></div>`;
  function showPanel(label, iconKey, learnKey, override) {
    const tip = card.querySelector('.tip'); if (!tip) return;
    const L = learnKey ? D.LEARN[learnKey] : null;
    const text = override || (L && L.tip);
    if (!text) { tip.hidden = true; return; }
    tip.querySelector('.head').innerHTML = `${iconKey ? ic(iconKey) : ic('spark')}<span>${label}</span>`;
    tip.querySelector('.tip-text').textContent = text;
    const more = tip.querySelector('.more'), det = tip.querySelector('.detail');
    det.hidden = true; more.classList.remove('is-open');
    if (L && !override) {
      det.innerHTML = `<p><b>${esc(T.assume)}</b> ${L.assume}</p><p><b>${esc(T.happens)}</b> ${L.happens}</p><p><b>${esc(T.worth_checking)}</b> ${L.check}</p>`;
      more.hidden = false;
      more.onclick = () => { det.hidden = !det.hidden; more.classList.toggle('is-open', !det.hidden); };
    } else more.hidden = true;
    tip.hidden = false;
    card.querySelectorAll('.info').forEach((b) => b.classList.toggle('is-open', b.dataset.learn === learnKey));
  }

  /* ---------- screens ---------- */
  const Q = () => D.Q;
  const visible = () => Q().filter(shows);
  const top = () => dialog.querySelector('.lc').scrollTo({ top: 0, behavior: 'smooth' });
  function render() {
    if (step === 0) return renderIntro();
    while (Q()[step - 1] && !shows(Q()[step - 1])) step += dir;
    if (step < 1) step = 1;
    const q = Q()[step - 1];
    if (!q) return renderResults();
    progress.hidden = false;
    updateProgress(q);
    let html = '';
    if (q.intro) html += `<p class="mirror">${q.intro}</p>`;
    if (q.mirror) { const m = mirrorLine(q); if (m) html += `<p class="mirror">${m}</p>`; }
    html += `<div class="stack"><h2>${q.title}</h2>${q.helper ? `<p class="lc-help">${q.helper}</p>` : ''}`;
    if (q.type === 'single') html += optsHtml(q, true);
    if (q.type === 'multi') html += optsHtml(q, false);
    if (q.type === 'ladder') html += ladderHtml(q);
    if (q.type === 'rate') html += rateHtml(q);
    if (q.type !== 'rate') html += panelHtml();
    html += `</div><div class="actions"><button type="button" class="link lc-back">${esc(T.back)}</button><button type="button" class="btn btn-primary lc-next" disabled>${esc(T.next)} ${ic('arrow')}</button></div>`;
    card.innerHTML = `<div class="screen stack">${html}</div>`;
    wire(q);
    top();
  }
  // the first screen: the button said "free call", so it says why five minutes come first (owner, 2026-10-19)
  function renderIntro() {
    progress.hidden = true;
    const I = T.intro;
    card.innerHTML = `<div class="screen stack">
      <figure class="lc-photo"><img src="/assets/images/people/chris-check.jpg" alt="${esc(I.photo_alt)}" width="960" height="720"></figure>
      <p class="lc-kicker">${I.kicker}</p>
      <h2 class="lc-h1">${I.title}</h2>
      <p class="lead">${I.lead}</p>
      <ol class="lc-gets">${I.gets.map((g, i) => `<li><span class="n">${i + 1}</span><span>${g}</span></li>`).join('')}</ol>
      <p class="muted">${I.note}</p>
      <div class="actions"><button type="button" class="btn btn-primary lc-start">${esc(T.start)} ${ic('arrow')}</button></div>
    </div>`;
    card.querySelector('.lc-start').onclick = () => { dir = 1; step = 1; render(); };
    top();
  }
  const infoBtn = (o) => (o.learn ? `<span class="info" role="button" tabindex="0" data-learn="${o.learn}" aria-label="${esc(T.why)}">i</span>` : '');
  const optsHtml = (q, single) => `<div class="opts" role="${single ? 'radiogroup' : 'group'}">` + q.opts.map((o) => `<button type="button" class="opt ${single ? 'single' : ''}" data-id="${o.id}" aria-pressed="false"><span class="box">${ic('check')}</span>${o.icon ? `<span class="ico">${ic(o.icon)}</span>` : ''}<span class="txt">${o.label}${o.ex ? `<span class="ex">${o.ex}</span>` : ''}</span>${infoBtn(o)}</button>`).join('') + '</div>';
  const ladderHtml = (q) => `<div class="ladder" role="radiogroup">` + q.opts.map((o, i) => `<button type="button" class="opt single" data-id="${o.id}" aria-pressed="false"><span class="step">${i + 1}</span><span class="txt"><span class="name">${o.name}</span>${o.label.replace('book', word('book', 'buy'))}</span>${infoBtn(o)}</button>`).join('') + '</div>';
  function rateHtml(q) {
    const picked = (A.channels || []).filter((id) => !channel(id).meta);
    if (!picked.length) return `<p class="mirror">${esc(T.rate_none)}</p>`;
    return `<div class="rate">` + picked.map((id) => `<div class="row" data-ch="${id}"><b>${ic(id)}${channel(id).label}</b><div class="choices">${q.choices.map((c) => `<button type="button" data-v="${c.id}">${c.label}</button>`).join('')}</div></div>`).join('') + '</div>';
  }
  // between blocks: the advice everyone gets, against what their own answers show
  function mirrorLine(q) {
    const M = T.mirror, bring = A.bring || {}, ch = A.channels || [];
    const picked = ch.filter((id) => !channel(id).meta);
    const sustains = picked.filter((id) => bring[id] === 'sustains').map((id) => channel(id).label.split(' (')[0].split(':')[0].toLowerCase());
    if (q.id === 'stall') {
      if (ch.includes('social') && bring.social !== 'sustains') return fmt(M.stall_social, { result: bring.social === 'some' ? M.social_some : M.social_little });
      if (!picked.length) return M.stall_start;
      if (sustains.length) return fmt(M.stall_sustains, { list: esc(sustains.join(` ${M.and} `)) });
      return picked.length === 1 ? M.stall_none_one : fmt(M.stall_none, { n: picked.length });
    }
    if (q.id === 'chosen') return A.stall === 's3' ? M.chosen_s3 : A.stall === 's2' ? M.chosen_s2 : M.chosen;
    if (q.id === 'booked') return A.stall === 's5' ? M.booked_s5 : A.stall === 's4' ? M.booked_s4 : M.booked;
    if (q.id === 'goal') return M.goal;
    return '';
  }
  const setOn = (b, on) => { b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); };
  function wire(q) {
    const next = card.querySelector('.lc-next');
    card.querySelector('.lc-back').onclick = () => { dir = -1; step = Math.max(0, step - 1); render(); };
    const ready = () => { next.disabled = !answered(q); };
    const optOf = (b) => q.opts.find((o) => o.id === b.dataset.id);
    card.querySelectorAll('.info').forEach((ib) => {
      const show = (e) => { e.preventDefault(); e.stopPropagation(); const o = optOf(ib.closest('.opt')); showPanel(o.name || o.label, o.icon, o.learn); };
      ib.onclick = show;
      ib.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') show(e); };
    });
    if (q.type === 'single' || q.type === 'ladder') {
      card.querySelectorAll('.opt').forEach((b) => (b.onclick = () => { card.querySelectorAll('.opt').forEach((x) => setOn(x, false)); setOn(b, true); A[q.id] = b.dataset.id; const o = optOf(b); showPanel(o.name || o.label, o.icon, o.learn); ready(); }));
      if (A[q.id]) { const b = card.querySelector(`.opt[data-id="${A[q.id]}"]`); if (b) setOn(b, true); }
    }
    if (q.type === 'multi') {
      A[q.id] = A[q.id] || [];
      card.querySelectorAll('.opt').forEach((b) => (b.onclick = () => {
        const opt = optOf(b), on = !b.classList.contains('is-on');
        if (opt.none && on) { card.querySelectorAll('.opt').forEach((x) => setOn(x, false)); A[q.id] = []; }
        if (!opt.none && on) { const n = card.querySelector('.opt[data-id="none"]'); if (n) { setOn(n, false); A[q.id] = A[q.id].filter((x) => x !== 'none'); } }
        setOn(b, on);
        A[q.id] = on ? [...A[q.id], opt.id] : A[q.id].filter((x) => x !== opt.id);
        const real = A[q.id].filter((x) => !(q.opts.find((o) => o.id === x) || {}).none && !(channel(x) || {}).meta);
        if (q.patternTip && real.length >= q.patternTip.min) showPanel(T.pattern_head, 'spark', null, q.patternTip.text);
        else if (on) showPanel(opt.label, opt.icon, opt.learn);
        else card.querySelector('.tip').hidden = true;
        ready();
      }));
      A[q.id].forEach((id) => { const b = card.querySelector(`.opt[data-id="${id}"]`); if (b) setOn(b, true); });
    }
    if (q.type === 'rate') {
      A.bring = A.bring || {};
      card.querySelectorAll('.row').forEach((row) => row.querySelectorAll('button').forEach((b) => (b.onclick = () => { row.querySelectorAll('button').forEach((x) => x.classList.remove('is-on')); b.classList.add('is-on'); A.bring[row.dataset.ch] = b.dataset.v; ready(); })));
      Object.entries(A.bring).forEach(([c, v]) => card.querySelector(`.row[data-ch="${c}"] button[data-v="${v}"]`)?.classList.add('is-on'));
    }
    ready();
    next.onclick = () => { dir = 1; step++; render(); };
  }
  function answered(q) {
    if (q.type === 'single' || q.type === 'ladder') return !!A[q.id];
    if (q.type === 'multi') return (A[q.id] || []).length > 0;
    if (q.type === 'rate') return (A.channels || []).filter((id) => !channel(id).meta).every((id) => (A.bring || {})[id]);
    return true;
  }
  function updateProgress(q) {
    const vis = visible(), total = vis.length, n = vis.indexOf(q) + 1;
    dialog.querySelector('.lc-ring-fill').style.strokeDashoffset = String(163.4 * (1 - (n - 1) / total));
    dialog.querySelector('.lc-ring-num').textContent = String(n);
    dialog.querySelector('.lc-step').textContent = fmt(T.step, { n, total });
    const reached = Math.max(-1, ...Q().slice(0, step).map((x) => D.ORDER.indexOf(x.stage)));
    dialog.querySelectorAll('.lc-pills span').forEach((p) => p.classList.toggle('on', D.ORDER.indexOf(p.dataset.stage) <= reached));
  }

  /* ---------- scoring (code decides, text follows) ---------- */
  const clamp = (n) => Math.max(0, Math.min(10, Math.round(n)));
  function score() {
    const s = {}, ch = A.channels || [], bring = A.bring || {};
    let seen = 2;
    ch.forEach((id) => { const v = bring[id], c = channel(id); if (!c || c.meta) return;
      if (v === 'sustains') seen += c.controllable ? 4 : 2;
      if (v === 'some') seen += c.controllable ? 2 : 1;
      if (v === 'none') seen -= 1; });
    if (ch.includes('unsure')) seen = Math.min(seen, 3);
    if (ch.includes('starting')) seen = Math.min(seen, 2);
    if (A.stall === 's1') seen -= 2;
    s.seen = clamp(seen);
    const ticks = (id) => (A[id] || []).filter((x) => x !== 'none').length;
    s.chosen = clamp(ticks('chosen') * 2 - (A.stall === 's2' || A.stall === 's3' ? 3 : 0));
    s.booked = clamp(ticks('booked') * 2 - (A.stall === 's4' || A.stall === 's5' ? 3 : 0) + (A.stall === 's6' ? 1 : 0));
    s.remembered = clamp(ticks('remembered') * 2 + (ch.includes('referrals') ? 1 : 0) + (ch.includes('email') ? 1 : 0));
    const stallStage = { s1: 'seen', s2: 'chosen', s3: 'chosen', s4: 'booked', s5: 'booked' }[A.stall];
    const order = [...D.ORDER].sort((a, b) => s[a] - s[b] || (a === stallStage ? -1 : b === stallStage ? 1 : 0));
    const healthy = D.ORDER.every((k) => s[k] >= 6) || (A.intent === 'grow' && D.ORDER.every((k) => s[k] >= 4));
    return { s, weakest: order[0], second: order[1], healthy };
  }
  const nextKey = () => A.next || (A.goal === 'shop' || (A.business || []).includes('digital') ? 'product' : 'more');
  function findings(R) {
    const F = T.findings, out = [], ch = A.channels || [], bring = A.bring || {};
    const real = ch.filter((id) => !channel(id).meta);
    const controllableWorks = real.some((id) => channel(id).controllable && ['sustains', 'some'].includes(bring[id]));
    const stall = { s1: controllableWorks ? F.s1 : F.s1_noreach, s2: F.s2, s3: F.s3, s4: fmt(F.s4, { book: word('book', 'buy') }), s5: F.s5 }[A.stall];
    if (stall) out.push({ t: stall, why: F.why_stall });
    if (bring.ads === 'sustains') out.push({ t: F.ads_sustains, why: F.why_ads_sustains });
    if (bring.social === 'none') out.push({ t: F.social_none, why: F.why_social_none });
    if (bring.ads === 'none') out.push({ t: F.ads_none, why: F.why_ads_none });
    if (bring.ads === 'stopped') out.push({ t: F.ads_stopped, why: F.why_ads_stopped });
    if (bring.events === 'none') out.push({ t: F.events_none, why: F.why_events_none });
    const sustaining = real.filter((id) => bring[id] === 'sustains');
    const othersOnly = sustaining.length && sustaining.every((id) => ['referrals', 'local', 'partners'].includes(id));
    if (othersOnly && !controllableWorks) out.push({ t: F.referrals_only, why: F.why_referrals_only });
    if (real.length >= 4 && !sustaining.length) out.push({ t: F.many, why: fmt(F.why_many, { n: real.length }) });
    if (ch.includes('unsure')) out.push({ t: F.unsure, why: F.why_unsure });
    if (ch.includes('starting')) out.unshift({ t: F.starting, why: F.why_starting });
    const miss = (qid, oid, t) => { if (!(A[qid] || []).includes(oid)) out.push({ t, why: F.why_missing }); };
    if (R.weakest === 'chosen') { miss('chosen', 'price', F.chosen_price); miss('chosen', 'proof', F.chosen_proof); }
    if (R.weakest === 'booked') { miss('booked', 'calendar', fmt(F.booked_calendar, { booking: word('booking', 'purchase') })); miss('booked', 'reminders', F.booked_reminders); }
    if (R.weakest === 'remembered') { miss('remembered', 'rebook', F.remembered_rebook); miss('remembered', 'list', F.remembered_list); }
    if (R.healthy) {
      const g = [{ t: F.healthy, why: F.why_healthy }, { t: D.NEXT[nextKey()], why: F.why_next }];
      if ((A.chosen || []).includes('proof')) g.push({ t: F.proof, why: F.why_proof });
      else if (othersOnly) g.push({ t: F.no_proof, why: F.why_no_proof });
      else g.push({ t: F.controllable, why: F.why_controllable });
      return g.slice(0, 3);
    }
    if (A.intent === 'grow') out.push({ t: D.NEXT[nextKey()], why: F.why_next });
    return out.slice(0, 3);
  }
  function fit() {
    const ch = A.channels || [], bring = A.bring || {}, spend = Number(A.spend || 0), vol = Number(A.volume || 0);
    if (A.intent === 'start' || ch.includes('starting') || vol === 0) return 'nofit';
    if ((bring.ads === 'stopped' || bring.ads === 'none') && spend < 100) return 'burned';
    if (spend >= 100 || vol >= 6) return 'good';
    return 'notyet';
  }
  function quickWin(R) {
    const ch = A.channels || [], bring = A.bring || {};
    const controllable = ch.filter((id) => !channel(id).meta).some((id) => channel(id).controllable && ['sustains', 'some'].includes(bring[id]));
    if (R.healthy) return T.quick_healthy[nextKey()];
    if (R.weakest === 'seen' && !controllable) return T.quick_seen_referrals;
    if (R.weakest === 'booked' && A.stall === 's5') return T.quick_booked_s5;
    return D.QUICK[R.weakest];
  }

  /* ---------- results, the call, the email gate ---------- */
  const STATUS = (R, k) => (k === R.weakest && !R.healthy ? T.status.weakest : R.s[k] <= 3 ? T.status.leaking : R.s[k] <= 6 ? T.status.holding : T.status.working);
  const barsHtml = (R) => `<div class="bars">` + D.ORDER.map((k) => { const st = STATUS(R, k); const lvl = st === T.status.working ? 3 : st === T.status.holding ? 2 : 1; const weak = k === R.weakest && !R.healthy; return `<div class="bar ${weak ? 'weak' : ''}"><div class="top"><span class="lab">${ic(k)}${esc(stageShort(k))}</span><span class="dots" aria-hidden="true">${[1, 2, 3].map((i) => `<i class="${i <= lvl ? 'on' : ''}"></i>`).join('')}</span><span class="num">${esc(st)}</span></div><button type="button" class="more">${esc(T.means)}</button><p class="explain" hidden>${D.STAGE_EXPLAIN[k]}</p></div>`; }).join('') + '</div>';
  // the answers in words, for the owner's notification and the report she writes
  function answersText(R) {
    const lines = [];
    for (const q of visible()) {
      const t = q.title.replace(/<[^>]+>/g, '');
      let a = '';
      if (q.type === 'rate') a = Object.entries(A.bring || {}).map(([c, v]) => `${channel(c).label}: ${(q.choices.find((x) => x.id === v) || {}).label}`).join('; ');
      else if (Array.isArray(A[q.id])) a = A[q.id].map((id) => { const o = q.opts.find((x) => x.id === id); return o ? (o.name || o.label) : id; }).join('; ');
      else { const o = (q.opts || []).find((x) => x.id === A[q.id]); a = o ? (o.name ? `${o.name}: ${o.label}` : o.label) : ''; }
      if (a) lines.push(`${t}\n  ${a}`);
    }
    lines.push(`Stages: ${D.ORDER.map((k) => `${stageName(k)} ${STATUS(R, k)}`).join(', ')}`);
    return lines.join('\n');
  }
  function renderResults() {
    progress.hidden = true;
    const R = score(), F = findings(R), fitKey = fit(), Rs = T.results;
    const weak = stageLower(R.weakest);
    const head = R.healthy ? Rs.healthy
      : A.intent === 'grow' ? fmt(Rs.grow, { stage: weak })
      : A.intent === 'start' ? fmt(Rs.start, { stage: weak })
      : (!A.guess || A.guess === 'unsure') ? fmt(Rs.plain, { stage: weak })
      : A.guess === R.weakest ? fmt(Rs.right, { stage: weak })
      : fmt(Rs.wrong, { guess: stageLower(A.guess), stage: weak });
    const goalStage = { seen: 'seen', chosen: 'chosen', chosen2: 'chosen', booked: 'booked', booked2: 'booked', remembered: 'remembered', content: 'seen', shop: 'booked', loop: null }[A.goal];
    const want = R.healthy ? fmt(Rs.healthy_line, { stage: stageName(R.weakest).replace(/^Be /, 'Being ') })
      : goalStage && goalStage !== R.weakest ? fmt(Rs.want_need, { goal: stageLower(goalStage), when: D.ORDER.indexOf(R.weakest) > D.ORDER.indexOf(goalStage) ? Rs.later : Rs.earlier, line: D.STAGE_LINE[R.weakest] })
      : fmt(Rs.plain_line, { line: D.STAGE_LINE[R.weakest], second: stageLower(R.second) });
    const worth = Number(A.worth || 0);
    const euros = worth && !R.healthy ? `<p class="muted">${fmt(Rs.euros, { amount: (worth * 12).toLocaleString(document.documentElement.lang || 'en') })}</p>` : '';
    const C = T.call, Fm = T.form;
    card.innerHTML = `<div class="screen stack">
      <p class="lc-help">${esc(Rs.label)}</p>
      <h2 class="lc-h1">${head}</h2>
      <p>${want}</p>${euros}
      ${barsHtml(R)}
      <div class="findings">${F.map((f, i) => `<div class="finding"><span class="n">${i + 1}</span><div><p>${f.t}</p><small>${f.why}</small></div></div>`).join('')}</div>
      <div class="quick"><h3>${ic('spark')}${esc(Rs.quick)}</h3><p>${quickWin(R)}</p></div>
      <p class="limit">${Rs.limit}</p>
      <div class="lc-call"><h3>${R.healthy ? C.title_healthy : fmt(C.title, { stage: weak })}</h3><p>${R.healthy ? C.healthy : C[R.weakest]}</p>
        <ul>${C.outcomes.map((o) => `<li>${ic('check')}<span>${o}</span></li>`).join('')}</ul><p class="muted">${C.length}</p></div>
      <form class="band stack lc-form" novalidate>
        <h3>${esc(Fm.title)}</h3><p>${Fm.text}</p>
        <div class="field"><label for="lc-name">${esc(Fm.name)}</label><input class="control" id="lc-name" name="name" type="text" autocomplete="name"></div>
        <div class="field"><label for="lc-email">${esc(Fm.email)}</label><input class="control" id="lc-email" name="email" type="email" autocomplete="email" inputmode="email"></div>
        <label class="check"><input type="checkbox" name="privacy" value="yes"><span>${Fm.privacy}</span></label>
        <p class="err" hidden></p>
        <div class="actions"><button class="btn btn-light" type="submit"><span class="btn-label">${esc(Fm.submit)}</span> ${ic('arrow')}</button></div>
      </form>
      <button type="button" class="link lc-restart">${esc(Rs.restart)}</button>
    </div>`;
    card.querySelectorAll('.bar .more').forEach((b) => (b.onclick = () => { const p = b.nextElementSibling; p.hidden = !p.hidden; b.textContent = p.hidden ? T.means : T.hide; }));
    card.querySelector('.lc-restart').onclick = () => { for (const k in A) if (k !== '__source') delete A[k]; step = 0; render(); };
    const form = card.querySelector('.lc-form'), err = form.querySelector('.err');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const name = form.elements.name.value.trim(), email = form.elements.email.value.trim();
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = Fm.need; err.hidden = false; return; }
      if (!form.elements.privacy.checked) { err.textContent = Fm.consent; err.hidden = false; return; }
      err.hidden = true;
      const button = form.querySelector('[type=submit]'), label = button.querySelector('.btn-label');
      button.disabled = true; label.textContent = Fm.sending;
      // sent as the site's "lead" form: the CRM takes it like any lead, and Netlify sends one notification
      const lead = document.querySelector('#lead form');
      const body = new URLSearchParams({ 'form-name': 'lead', name, email, whatsapp: '', interest: 'The System', privacy: 'yes', source: `loop check, ${A.__source || location.pathname}`, weakest: stageName(R.weakest), fit: fitKey, answers: answersText(R) });
      ['utm_source', 'utm_campaign', 'utm_content', 'fbclid'].forEach((k) => body.set(k, lead?.elements[k]?.value || ''));
      try {
        const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
        if (!res.ok) throw new Error(String(res.status));
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'loop check' });
        const done = { name, email, stage: stageName(R.weakest), fit: fitKey };
        try { sessionStorage.setItem(DONE, JSON.stringify(done)); } catch { /* storage blocked */ }
        renderDone(done);
      } catch {
        err.textContent = Fm.failed; err.hidden = false;
        button.disabled = false; label.textContent = Fm.submit;
      }
    };
    top();
  }
  const bookLink = (done) => {
    const number = (dialog.dataset.whatsapp || '').replace(/\D/g, '');
    const text = fmt(T.done.whatsapp_message, { name: done.name, stage: done.stage });
    return number ? `<a class="btn btn-light" href="https://wa.me/${number}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">${esc(T.done.button)} ${ic('arrow')}</a>` : '';
  };
  function renderDone(done) {
    const Dn = T.done;
    const band = card.querySelector('.lc-form');
    band.outerHTML = `<div class="band stack lc-booked">
      <p class="done">${ic('check')} ${esc(fmt(Dn.title, { name: done.name, email: done.email }))}</p>
      <p>${Dn.note}</p>
      <h3>${esc(Dn.book_title)}</h3><p>${Dn.bands[done.fit] || Dn.bands.good}</p><p>${Dn.after}</p>
      <div class="actions">${bookLink(done)}</div>
    </div>`;
    card.querySelector('.lc-booked h3').scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  function renderReturning(done) {
    progress.hidden = true;
    card.innerHTML = `<div class="screen stack"><h2 class="lc-h1">${fmt(T.returning.title, { name: esc(done.name) })}</h2><p>${T.returning.text}</p><div class="band stack"><p>${T.done.bands[done.fit] || T.done.bands.good}</p><div class="actions">${bookLink(done)}</div></div></div>`;
  }
})();
