'use strict';
/* Ribbon & Co. — customer flow demo. All data is mocked and stored in localStorage. */

/* ---------- Mock catalogue ---------- */
const PACKAGES = [
  { id: 'classic', name: 'The Classic', price: 58, incl: 3, extra: 14, mins: 45, wrappers: 1, badge: 'Quick & elegant',
    tag: 'Refined wrapping for everyday occasions.',
    feats: ['Premium matte paper', 'Hand-tied satin bow', 'Printed gift tag'] },
  { id: 'signature', name: 'The Signature', price: 95, incl: 5, extra: 18, mins: 75, wrappers: 1, badge: 'Most loved',
    tag: 'Our signature layered finish, styled to your palette.',
    feats: ['Double-layer paper & velvet ribbon', 'Dried botanical accent', 'Wax-sealed custom tag', 'Tissue & scented sachet'] },
  { id: 'atelier', name: 'The Atelier', price: 165, incl: 8, extra: 24, mins: 120, wrappers: 1, badge: 'Bespoke',
    tag: 'Made-to-measure boxes and hand-lettered detail.',
    feats: ['Bespoke rigid gift boxes', 'Silk ribbon & fresh florals', 'Hand-lettered calligraphy tags', 'Senior wrapper'] },
  { id: 'maison', name: 'Maison Couture', price: 340, incl: 12, extra: 32, mins: 180, wrappers: 2, badge: 'Couture',
    tag: 'A fully themed, photo-ready gifting experience.',
    feats: ['Two master wrappers', 'Custom monogram & themed styling', 'Fabric furoshiki wraps', 'Gift-table styling & photo set'] },
];
const PALETTES = [
  { id: 'noir', name: 'Noir', paper: '#17171a', rib: '#c9a45c' },
  { id: 'ivory', name: 'Ivory', paper: '#ece4d2', rib: '#b8975a' },
  { id: 'blush', name: 'Blush', paper: '#e8c5c0', rib: '#b9786b' },
  { id: 'emerald', name: 'Emerald', paper: '#14463a', rib: '#d9bd7c' },
  { id: 'midnight', name: 'Midnight', paper: '#1b2a4a', rib: '#c0c8d8' },
];
const ADDONS = [
  { id: 'calli', name: 'Hand-lettered tags', desc: 'Calligraphy for every gift', price: 18 },
  { id: 'seal', name: 'Monogram wax seal', desc: 'Your initials in sealing wax', price: 22 },
  { id: 'flora', name: 'Fresh floral accent', desc: 'Seasonal stems on each gift', price: 28 },
  { id: 'box', name: 'Bespoke gift box', desc: 'Rigid box for awkward shapes', price: 35 },
  { id: 'furo', name: 'Furoshiki fabric wrap', desc: 'Reusable silk-blend cloth', price: 20 },
];
const OCCASIONS = ['Birthday', 'Holiday', 'Wedding', 'Anniversary', 'Baby', 'Corporate', 'Just because'];
const PLACES = [
  '350 5th Ave, New York, NY 10118', '1 Rockefeller Plaza, New York, NY 10020', '27 W 72nd St, New York, NY 10023',
  '88 Greene St, New York, NY 10012', '200 Park Ave, New York, NY 10166', '15 Hudson Yards, New York, NY 10001',
  '1 Columbus Cir, New York, NY 10019', '520 W 27th St, New York, NY 10001', '45 Main St, Brooklyn, NY 11201',
  '1000 5th Ave, New York, NY 10028', '30 Rockefeller Plaza, New York, NY 10112', '725 5th Ave, New York, NY 10022',
];
const SAVED = [
  { label: 'Home', line: '27 W 72nd St, New York, NY 10023', unit: 'Apt 5B' },
  { label: 'Office', line: '1 Rockefeller Plaza, New York, NY 10020', unit: 'Floor 14' },
];
const PAYMENTS = [
  { id: 'visa', name: 'Visa •••• 4242', logo: 'VISA' },
  { id: 'amex', name: 'Amex •••• 1005', logo: 'AMEX' },
  { id: 'apple', name: 'Apple Pay', logo: 'PAY' },
];
const WRAPPER = { name: 'Camille Laurent', rating: 4.98, wraps: 1240, car: 'Black Tesla Model Y · LUX 482', bio: 'Trained in Paris. Loves a perfect corner.' };
const STAGES = [
  { id: 'confirmed', label: 'Booking confirmed' },
  { id: 'assigned', label: 'Wrapper assigned' },
  { id: 'enroute', label: 'On the way' },
  { id: 'arrived', label: 'Arrived' },
  { id: 'wrapping', label: 'Wrapping your gifts' },
  { id: 'done', label: 'Complete' },
];
const PROMOS = { WRAP10: 0.1, WELCOME15: 0.15 };
const TAX = 0.08875, SERVICE_FEE = 6, ASAP_FEE = 15;

/* ---------- Helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
const pkgOf = id => PACKAGES.find(p => p.id === id);
const palOf = id => PALETTES.find(p => p.id === id) || PALETTES[0];
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const hourLabel = h => `${((h + 11) % 12) + 1}:00 ${h < 12 ? 'AM' : 'PM'}`;
const timeLabel = t => (t === 'asap' ? 'As soon as possible' : hourLabel(+t));
const dayLong = s => fromIso(s).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
const dayShort = s => fromIso(s).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

const ICONS = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  back: '<path d="M15 5l-7 7 7 7"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', chev: '<path d="M9 5l7 7-7 7"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>', phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', sparkle: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>', gift: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9C8 9 7 4 10 4s2 5 2 5zm0 0c4 0 5-5 2-5s-2 5-2 5z"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/>', share: '<path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6"/>',
  reset: '<path d="M4 4v6h6M4.5 15a8 8 0 100-6"/>', star: '<path d="M12 2l3 7 7.5.6-5.7 5 1.8 7.4L12 18l-6.6 4 1.8-7.4-5.7-5L9 9z"/>',
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;

/** Illustrated gift box, coloured by palette. */
function gift(palId, size) {
  const p = palOf(palId);
  return `<svg class="gift" viewBox="0 0 120 120" ${size ? `width="${size}" height="${size}"` : ''} aria-hidden="true">
    <ellipse cx="60" cy="108" rx="40" ry="5" fill="#000" opacity=".35"/>
    <rect x="18" y="56" width="84" height="48" rx="4" fill="${p.paper}" stroke="${p.rib}" stroke-opacity=".5"/>
    <rect x="12" y="42" width="96" height="20" rx="4" fill="${p.paper}" stroke="${p.rib}" stroke-opacity=".7"/>
    <rect x="53" y="42" width="14" height="62" fill="${p.rib}"/><rect x="12" y="48" width="96" height="6" fill="${p.rib}" opacity=".0"/>
    <path d="M60 42C40 42 26 32 34 21c7-8 22 2 26 21zM60 42c20 0 34-10 26-21-7-8-22 2-26 21z" fill="none" stroke="${p.rib}" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="60" cy="42" r="5" fill="${p.rib}"/></svg>`;
}

/* ---------- State ---------- */
const KEY = 'ribbon-demo-v1';
function seed() {
  const d = new Date(); d.setDate(d.getDate() - 21);
  const d2 = new Date(); d2.setDate(d2.getDate() - 70);
  const mk = (id, pkg, gifts, pal, date, time, addr, total) => ({
    id, pkg, gifts, palette: pal, occasion: 'Birthday', addons: [], note: '', date: iso(date), time, address: addr, total, status: 'done', rating: 5,
    createdAt: date.getTime() - 86400000 * 3, pay: 'visa',
  });
  return {
    draft: null,
    bookings: [
      mk('GW-48211', 'signature', 4, 'ivory', d, '14', { ...SAVED[0] }, 124.4),
      mk('GW-39027', 'classic', 3, 'noir', d2, '11', { ...SAVED[1] }, 71.8),
    ],
    sim: {},
  };
}
let S;
try { S = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { S = seed(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* private mode */ } };

function firstOpenDate() {
  for (let i = 0; i < 14; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    if (slotsFor(iso(d)).some(s => s.free)) return iso(d);
  }
  return iso(new Date());
}
function newDraft(pkgId) {
  const p = pkgOf(pkgId || 'signature');
  return { pkg: p.id, gifts: p.incl, occasion: 'Birthday', palette: 'noir', addons: [], note: '', date: firstOpenDate(), time: null,
    address: null, promo: '', tip: 0.1, pay: 'visa' };
}
const draft = () => S.draft || (S.draft = newDraft());

/* ---------- Pricing & availability ---------- */
function quote(d) {
  const p = pkgOf(d.pkg);
  const extra = Math.max(0, d.gifts - p.incl) * p.extra;
  const addons = d.addons.reduce((a, id) => a + ADDONS.find(x => x.id === id).price, 0);
  const asap = d.time === 'asap' ? ASAP_FEE : 0;
  const base = p.price + extra + addons;
  const rate = PROMOS[(d.promo || '').toUpperCase()] || 0;
  const discount = base * rate;
  const taxable = base - discount + asap + SERVICE_FEE;
  const tax = taxable * TAX;
  const tip = (p.price + extra) * (d.tip || 0);
  return { p, extra, addons, asap, base, discount, fee: SERVICE_FEE, tax, tip, total: taxable + tax + tip };
}
function slotsFor(dateIso) {
  const now = new Date(), today = iso(now) === dateIso, out = [];
  for (let h = 9; h <= 19; h++) {
    const past = today && h <= now.getHours() + 1;
    const booked = hash(dateIso + h) % 4 === 0;
    out.push({ h, free: !past && !booked });
  }
  return out;
}
const asapAvailable = () => { const h = new Date().getHours(); return h >= 8 && h < 20; };

/* ---------- UI utilities ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}
function openSheet(html, onMount) {
  closeSheet();
  const bg = document.createElement('div'); bg.id = 'sheetbg';
  bg.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  bg.addEventListener('click', e => { if (e.target === bg) closeSheet(); });
  $('#shell').appendChild(bg);
  onMount && onMount(bg);
}
function closeSheet() { $('#sheetbg')?.remove(); }

function tabbar(active) {
  const t = (h, n, l) => `<a href="#/${h}" class="${active === h ? 'on' : ''}">${ic(n)}${l}</a>`;
  return `<nav class="tabs">${t('', 'home', 'Home')}${t('bookings', 'cal', 'Bookings')}${t('account', 'user', 'Account')}</nav>`;
}
const STEPS = ['packages', 'customize', 'schedule', 'address', 'review'];
function flow(step, title, sub, body, cta) {
  const back = step === 0 ? '#/' : '#/' + STEPS[step - 1];
  const d = draft(), q = quote(d);
  return `<div class="screen">
    <div class="topbar"><a class="iconbtn" href="${back}" aria-label="Back">${ic('back')}</a>
      <div class="grow tiny muted">Step ${step + 1} of ${STEPS.length}</div>
      <a class="iconbtn" href="#/" data-act="exit" aria-label="Close">${ic('close')}</a></div>
    <div class="progress">${STEPS.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>
    <h1 class="title">${title}</h1><p class="sub">${sub}</p>${body}
    <div class="cta">${step > 0 ? `<div class="total"><span>Estimated total</span><b>${money(q.total)}</b></div>` : ''}${cta}</div></div>`;
}

/* ---------- Screens ---------- */
const routes = [];
const route = (re, fn) => routes.push([re, fn]);

route(/^$/, () => {
  const up = S.bookings.filter(b => b.status !== 'done' && b.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date))[0];
  const hr = new Date().getHours();
  const hello = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
  return { tab: '', html: `<div class="screen">
    <div class="hero"><div class="brand">Ribbon &amp; Co.</div>
      <h1>Beautifully wrapped,<br><em>at your door.</em></h1>
      <p class="muted small">${hello}, Josh. A master wrapper, anywhere in Manhattan &amp; Brooklyn.</p>
      <button class="where" data-act="start"><span class="dot"></span><span class="grow"><span class="tiny muted" style="display:block">Wrap at</span>
        ${esc((S.draft && S.draft.address?.line) || SAVED[0].line)}</span>${ic('chev')}</button>
      <button class="btn mt16" data-act="start">Book a wrapper</button></div>
    ${up ? `<div class="sec"><h3>Upcoming</h3></div><div class="stack">${bookingCard(up)}</div>` : ''}
    <div class="sec"><h3>Packages</h3><a href="#/packages">See all</a></div>
    <div class="pkgrow">${PACKAGES.map((p, i) => `<button class="mini" data-act="start" data-pkg="${p.id}">
      ${gift(PALETTES[i % PALETTES.length].id)}<b>${p.name}</b><span class="muted small">From ${money(p.price)} · ${p.incl} gifts</span></button>`).join('')}</div>
    <div class="sec"><h3>The Ribbon promise</h3></div>
    <div class="perks"><div>${ic('sparkle')}<br>Master wrappers</div><div>${ic('bolt')}<br>Same-day available</div><div>${ic('shield')}<br>Insured &amp; vetted</div></div>
    <div class="sec"></div><p class="quote">“I handed over a pile of boxes and an hour later it looked like a boutique window.”<br><span class="small muted" style="font-style:normal">— Eleanor, Upper West Side</span></p>
  </div>${tabbar('')}` };
});

route(/^packages$/, () => {
  const d = draft();
  return { html: flow(0, 'Choose your<br>wrapping package', 'Every package includes materials, a professional wrapper and cleanup.',
    `<div class="stack">${PACKAGES.map((p, i) => `<button class="pkg ${d.pkg === p.id ? 'on' : ''}" data-act="pick-pkg" data-id="${p.id}">
      <div class="top">${gift(d.palette === 'noir' ? PALETTES[i + 1 > 4 ? 0 : i].id : d.palette)}
      <div class="grow"><span class="badge">${p.badge}</span><h3>${p.name}</h3>
      <div class="price">${money(p.price)}</div><div class="muted small">${p.incl} gifts included · ~${p.mins >= 120 ? p.mins / 60 + ' hrs' : p.mins + ' min'}${p.wrappers > 1 ? ' · 2 wrappers' : ''}</div></div></div>
      <p class="muted small mt8">${p.tag}</p>
      <ul class="feat">${p.feats.map(f => `<li>${ic('check')}${f}</li>`).join('')}</ul></button>`).join('')}</div>`,
    `<a class="btn" href="#/customize">Continue with ${pkgOf(d.pkg).name}</a>`) };
});

route(/^customize$/, () => {
  const d = draft(), p = pkgOf(d.pkg);
  return { html: flow(1, 'Make it yours', `${p.name} · ${p.incl} gifts included, extra gifts ${money(p.extra)} each.`,
    `<div class="pad"><div class="card row between"><div><b>Number of gifts</b><div class="muted small">${d.gifts > p.incl ? `+${money((d.gifts - p.incl) * p.extra)} for ${d.gifts - p.incl} extra` : 'Included in package'}</div></div>
      <div class="stepper"><button data-act="gifts" data-d="-1" ${d.gifts <= 1 ? 'disabled' : ''} aria-label="Fewer">${ic('minus')}</button><b>${d.gifts}</b>
      <button data-act="gifts" data-d="1" ${d.gifts >= 30 ? 'disabled' : ''} aria-label="More">${ic('plus')}</button></div></div></div>
    <div class="sec"><h3>Occasion</h3></div><div class="chips">${OCCASIONS.map(o => `<button class="chip ${d.occasion === o ? 'on' : ''}" data-act="occasion" data-v="${o}">${o}</button>`).join('')}</div>
    <div class="sec"><h3>Palette</h3></div><div class="swatches">${PALETTES.map(p => `<button class="sw ${d.palette === p.id ? 'on' : ''}" data-act="palette" data-id="${p.id}">
      <i style="background:${p.paper};--rib:${p.rib}"></i>${p.name}</button>`).join('')}</div>
    <div class="sec"><h3>Enhancements</h3></div><div class="stack">${ADDONS.map(a => `<button class="opt ${d.addons.includes(a.id) ? 'on' : ''}" data-act="addon" data-id="${a.id}">
      <span class="check">${ic('check')}</span><span class="grow"><b>${a.name}</b><span class="muted small" style="display:block">${a.desc}</span></span><span class="gold">+${money(a.price)}</span></button>`).join('')}</div>
    <div class="sec"><h3>Notes for your wrapper</h3></div><div class="pad"><label class="field"><span>Optional</span>
      <textarea rows="3" data-bind="note" placeholder="Fragile items, recipient names for tags, themes…">${esc(d.note)}</textarea></label></div>`,
    `<a class="btn" href="#/schedule">Choose date &amp; time</a>`) };
});

route(/^schedule$/, () => {
  const d = draft();
  if (!slotsFor(d.date).some(s => s.free) && d.time !== 'asap') d.date = firstOpenDate();
  const days = Array.from({ length: 14 }, (_, i) => { const x = new Date(); x.setDate(x.getDate() + i); return x; });
  const today = d.date === iso(new Date());
  const slots = slotsFor(d.date);
  return { html: flow(2, 'When should we<br>arrive?', 'Your wrapper arrives within 15 minutes of the chosen time.',
    `${asapAvailable() ? `<div class="pad mb8"><button class="asap ${d.time === 'asap' ? 'on' : ''}" data-act="asap"><span class="bolt">${ic('bolt')}</span>
      <span class="grow"><b>Wrap me now</b><span class="muted small" style="display:block">A wrapper can be with you in ~60 min · +${money(ASAP_FEE)}</span></span>${d.time === 'asap' ? `<span class="check on">${ic('check')}</span>` : ''}</button></div>` : ''}
    <div class="sec"><h3>Pick a day</h3><span class="muted small">${d.date.slice(0, 4)}</span></div>
    <div class="days">${days.map(x => { const k = iso(x); return `<button class="day ${d.date === k && d.time !== 'asap' ? 'on' : ''}" data-act="day" data-v="${k}">
      <small>${x.toLocaleDateString('en-US', { weekday: 'short' })}</small><b>${x.getDate()}</b><small>${x.toLocaleDateString('en-US', { month: 'short' })}</small></button>`; }).join('')}</div>
    <div class="sec"><h3>${today ? 'Today' : dayShort(d.date)}</h3><span class="muted small">${slots.filter(s => s.free).length} slots open</span></div>
    <div class="slots">${slots.map(s => `<button class="slot ${d.time === String(s.h) && d.time !== 'asap' ? 'on' : ''}" ${s.free ? '' : 'disabled'} data-act="slot" data-v="${s.h}">${hourLabel(s.h)}</button>`).join('')}</div>`,
    `<a class="btn" ${d.time ? 'href="#/address"' : 'disabled'}>${d.time ? 'Confirm ' + (d.time === 'asap' ? 'as soon as possible' : dayShort(d.date) + ', ' + hourLabel(+d.time)) : 'Select a time'}</a>`) };
});

route(/^address$/, () => {
  const d = draft(), a = d.address;
  return { html: flow(3, 'Where are we<br>wrapping?', 'Share the address and any access details for your wrapper.',
    `<div class="searchbox">${ic('search')}<input id="q" placeholder="Search address" autocomplete="off" aria-label="Search address"></div>
    <div class="pad" id="results"></div>
    <div class="pad"><button class="sugg" data-act="locate"><span class="pin">${ic('pin')}</span><span class="grow"><b>Use current location</b><span class="muted small" style="display:block">Demo: uses a sample address</span></span></button></div>
    <div class="sec"><h3>Saved places</h3></div><div class="pad">${SAVED.map((s, i) => `<button class="sugg ${a && a.line === s.line ? 'on' : ''}" data-act="saved" data-i="${i}">
      <span class="pin">${ic(i ? 'cal' : 'home')}</span><span class="grow"><b>${s.label}</b><span class="muted small" style="display:block">${s.line}</span></span></button>`).join('')}</div>
    ${a ? `<div class="sec"><h3>Details</h3></div><div class="minimap">${miniMap()}</div>
      <div class="stack mt16"><div class="card row">${ic('pin')}<div class="grow"><b>${esc(a.label || 'Selected address')}</b><div class="muted small">${esc(a.line)}</div></div></div>
      <label class="field"><span>Apt / suite / floor</span><input data-bind="address.unit" value="${esc(a.unit || '')}" placeholder="Apt 5B"></label>
      <label class="field"><span>Access instructions</span><textarea rows="2" data-bind="address.notes" placeholder="Doorman, buzzer code, parking…">${esc(a.notes || '')}</textarea></label>
      <label class="field"><span>Contact phone</span><input data-bind="address.phone" inputmode="tel" value="${esc(a.phone ?? '(212) 555-0142')}"></label></div>` : ''}`,
    `<a class="btn" ${a ? 'href="#/review"' : 'disabled'}>${a ? 'Review booking' : 'Select an address'}</a>`),
    mount() {
      const q = $('#q'), out = $('#results');
      q.addEventListener('input', () => {
        const v = q.value.trim().toLowerCase();
        const hits = v.length < 2 ? [] : PLACES.filter(p => p.toLowerCase().includes(v)).slice(0, 4);
        out.innerHTML = hits.length ? hits.map(h => `<button class="sugg" data-act="place" data-v="${esc(h)}"><span class="pin">${ic('pin')}</span>
          <span class="grow">${esc(h)}</span></button>`).join('') : v.length >= 2 ? `<p class="muted small" style="padding:12px 4px">No matches in demo data. Try “5th Ave” or “Greene”.</p>` : '';
      });
    } };
});

function miniMap() {
  return `<svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice"><rect width="400" height="140" fill="#101012"/>
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${i * 70 - 20} 0V140" stroke="#222226" stroke-width="10"/>`).join('')}
    ${[0, 1, 2].map(i => `<path d="M0 ${i * 55 + 15}H400" stroke="#222226" stroke-width="10"/>`).join('')}
    <circle cx="200" cy="70" r="22" fill="#c9a45c" opacity=".18"/><circle cx="200" cy="70" r="8" fill="#c9a45c"/></svg>`;
}

route(/^review$/, () => {
  const d = draft(), q = quote(d);
  const pal = palOf(d.palette);
  const invalid = !d.address ? 'address' : !d.time ? 'schedule' : null;
  if (invalid) return { redirect: '#/' + invalid };
  const promoOk = PROMOS[(d.promo || '').toUpperCase()];
  return { html: flow(4, 'Review &amp; book', 'Nothing is charged until your wrapper completes the job.',
    `<div class="pad"><div class="card"><div class="row">${gift(d.palette, 64)}<div class="grow"><h3>${q.p.name}</h3>
      <div class="muted small">${d.gifts} gifts · ${d.occasion} · ${pal.name}</div></div><a class="link" href="#/customize">Edit</a></div>
      <div class="hline"></div>
      <div class="kv">${ic('cal')}<div class="grow"><b>${d.time === 'asap' ? 'As soon as possible' : dayLong(d.date)}</b><div class="muted small">${d.time === 'asap' ? 'Wrapper arrives in ~60 min' : 'Arrives ' + hourLabel(+d.time)}</div></div><a class="link" href="#/schedule">Edit</a></div>
      <div class="kv">${ic('pin')}<div class="grow"><b>${esc(d.address.line)}</b><div class="muted small">${esc([d.address.unit, d.address.notes].filter(Boolean).join(' · ') || 'No extra details')}</div></div><a class="link" href="#/address">Edit</a></div></div></div>
    <div class="sec"><h3>Tip your wrapper</h3></div><div class="pad"><div class="tips">${[0, .1, .15, .2].map(t => `<button class="${d.tip === t ? 'on' : ''}" data-act="tip" data-v="${t}">${t ? t * 100 + '%' : 'None'}</button>`).join('')}</div></div>
    <div class="sec"><h3>Payment</h3></div><div class="stack">${PAYMENTS.map(p => `<button class="pay ${d.pay === p.id ? 'on' : ''}" data-act="pay" data-id="${p.id}"><span class="cardlogo">${p.logo}</span>
      <span class="grow">${p.name}</span><span class="check ${d.pay === p.id ? 'on' : ''}">${ic('check')}</span></button>`).join('')}</div>
    <div class="sec"><h3>Promo code</h3></div><div class="pad row"><label class="field grow"><span>Code</span><input id="promo" value="${esc(d.promo)}" placeholder="Try WRAP10" autocapitalize="characters"></label>
      <button class="btn sm ghost" data-act="promo">Apply</button></div>
    ${d.promo ? `<p class="small pad mt8 ${promoOk ? 'gold' : ''}" style="${promoOk ? '' : 'color:var(--danger)'}">${promoOk ? `${promoOk * 100}% off applied` : 'That code isn’t valid'}</p>` : ''}
    <div class="sec"><h3>Summary</h3></div><div class="pad"><div class="card sum">
      <div class="line"><span>${q.p.name}</span><span>${money(q.p.price)}</span></div>
      ${q.extra ? `<div class="line"><span>${d.gifts - q.p.incl} extra gifts</span><span>${money(q.extra)}</span></div>` : ''}
      ${d.addons.map(id => { const a = ADDONS.find(x => x.id === id); return `<div class="line"><span>${a.name}</span><span>${money(a.price)}</span></div>`; }).join('')}
      ${q.asap ? `<div class="line"><span>Same-day dispatch</span><span>${money(q.asap)}</span></div>` : ''}
      ${q.discount ? `<div class="line disc"><span>Promo ${esc(d.promo.toUpperCase())}</span><span>−${money(q.discount)}</span></div>` : ''}
      <div class="line"><span>Service fee</span><span>${money(q.fee)}</span></div>
      <div class="line"><span>Tax</span><span>${money(q.tax)}</span></div>
      ${q.tip ? `<div class="line"><span>Tip</span><span>${money(q.tip)}</span></div>` : ''}
      <div class="line tot"><span>Total</span><span>${money(q.total)}</span></div></div></div>
    <p class="muted small pad mt16">Free cancellation up to 24 hours before your appointment.</p>`,
    `<button class="btn" data-act="book">Book · ${money(q.total)}</button>`) };
});

route(/^confirmed\/([\w-]+)$/, id => {
  const b = S.bookings.find(x => x.id === id);
  if (!b) return { redirect: '#/bookings' };
  const p = pkgOf(b.pkg);
  const bits = Array.from({ length: 26 }, (_, i) => `<i style="left:${(i * 37) % 100}%;animation-delay:${(i % 9) * .15}s;background:${['#c9a45c', '#e6c98a', '#f4efe6', '#b9786b'][i % 4]}"></i>`).join('');
  return { html: `<div class="screen"><div class="confetti">${bits}</div>
    <div class="seal"><svg class="ic" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
    <h1 class="title center">You’re booked.</h1><p class="sub center">A confirmation has been sent to josh.d.walker@me.com</p>
    <div class="pad"><div class="card"><div class="row"><div class="grow"><div class="tiny muted">Booking</div><b>${b.id}</b></div><span class="status">Confirmed</span></div>
      <div class="hline"></div>
      <div class="kv">${ic('gift')}<div><b>${p.name}</b><div class="muted small">${b.gifts} gifts · ${esc(b.occasion)}</div></div></div>
      <div class="kv">${ic('cal')}<div><b>${b.time === 'asap' ? 'As soon as possible' : dayLong(b.date)}</b><div class="muted small">${b.time === 'asap' ? 'Arrives in ~60 min' : 'Arrives ' + hourLabel(+b.time)}</div></div></div>
      <div class="kv">${ic('pin')}<div><b>${esc(b.address.line)}</b><div class="muted small">${esc(b.address.unit || '')}</div></div></div></div>
      <p class="muted small mt16 center">Your wrapper is assigned shortly before arrival, and you’ll be notified.</p></div>
    <div class="cta"><a class="btn" href="#/track/${b.id}">Track my wrapper</a><div class="actions mt8"><button class="btn ghost" data-act="ics" data-id="${b.id}">${ic('cal')} Add to calendar</button><a class="btn ghost" href="#/">Done</a></div></div></div>` };
});

const bookingCard = b => {
  const p = pkgOf(b.pkg);
  return `<a class="bk" href="#/track/${b.id}" style="text-decoration:none;color:inherit">${gift(b.palette)}<div class="grow"><div class="row between"><b style="font-family:var(--serif);font-size:18px;font-weight:500">${p.name}</b>
    <span class="status ${b.status === 'done' ? 'done' : b.status === 'cancelled' ? 'cancelled' : ''}">${b.status === 'done' ? 'Completed' : b.status === 'cancelled' ? 'Cancelled' : STAGES.find(s => s.id === b.status).label}</span></div>
    <div class="muted small mt8">${b.time === 'asap' ? 'Today · ASAP' : dayShort(b.date) + ' · ' + hourLabel(+b.time)}</div>
    <div class="muted small">${esc(b.address.line)}</div></div></a>`;
};

route(/^bookings$/, () => {
  const tab = S.bkTab || 'up';
  const list = S.bookings.filter(b => (tab === 'up') === (b.status !== 'done' && b.status !== 'cancelled'))
    .sort((a, b) => tab === 'up' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  return { tab: 'bookings', html: `<div class="screen"><h1 class="title" style="padding-top:calc(24px + var(--safe-t))">Your bookings</h1>
    <div class="seg"><button class="${tab === 'up' ? 'on' : ''}" data-act="bktab" data-v="up">Upcoming</button><button class="${tab === 'past' ? 'on' : ''}" data-act="bktab" data-v="past">Past</button></div>
    <div class="stack">${list.length ? list.map(bookingCard).join('') : `<div class="empty">${gift('noir')}<p class="mt16">${tab === 'up' ? 'Nothing booked yet.' : 'No past bookings.'}</p>
      ${tab === 'up' ? '<button class="btn mt16" data-act="start">Book a wrapper</button>' : ''}</div>`}</div></div>${tabbar('bookings')}` };
});

route(/^account$/, () => ({ tab: 'account', html: `<div class="screen"><div class="pad" style="padding-top:calc(28px + var(--safe-t))"><div class="row"><div class="avatar">JW</div>
  <div><h2 style="font-size:24px">Josh Walker</h2><div class="muted small">josh.d.walker@me.com</div></div></div>
  <div class="card mt24 row between"><div><div class="tiny gold">Ribbon Circle</div><b>Gold member</b><div class="muted small">${S.bookings.filter(b => b.status === 'done').length} wraps completed</div></div>${ic('sparkle')}</div>
  <div class="mt16">${[['pin', 'Saved addresses', SAVED.length + ' places'], ['card', 'Payment methods', 'Visa •••• 4242'], ['gift', 'Promo codes', 'Try WRAP10']].map(([i, t, s]) =>
    `<button class="acct" data-act="soon">${ic(i)}<span class="grow"><b>${t}</b><span class="muted small" style="display:block">${s}</span></span>${ic('chev')}</button>`).join('')}
  <button class="acct" data-act="reset">${ic('reset')}<span class="grow"><b>Reset demo data</b><span class="muted small" style="display:block">Clear bookings and start fresh</span></span></button></div>
  <p class="muted small center mt24">Ribbon &amp; Co. demo · all data is mocked</p></div></div>${tabbar('account')}` }));

/* ---------- Tracking ---------- */
const ROUTE_D = 'M50 320 V250 H170 V160 H290 V90 H330';
function trackView(b) {
  const p = pkgOf(b.pkg), idx = STAGES.findIndex(s => s.id === b.status);
  const cancelled = b.status === 'cancelled';
  const head = {
    confirmed: ['Booking confirmed', 'A wrapper is assigned shortly before your appointment.'],
    assigned: [`${WRAPPER.name.split(' ')[0]} is your wrapper`, 'She’ll head your way shortly.'],
    enroute: [`${WRAPPER.name.split(' ')[0]} is on her way`, ''],
    arrived: [`${WRAPPER.name.split(' ')[0]} has arrived`, 'Please welcome your wrapper at the door.'],
    wrapping: ['Wrapping in progress', 'Sit back — the magic is happening.'],
    done: ['All wrapped!', 'We hope they love it.'],
    cancelled: ['Booking cancelled', 'No charge was made.'],
  }[b.status];
  const wrapperShown = idx >= 1 && !cancelled;
  const inprog = b.status === 'wrapping';
  const gifts = Array.from({ length: Math.min(b.gifts, 14) }, (_, i) => gift(b.palette).replace('<svg', `<svg data-g="${i}"`)).join('');
  const nextLabel = { confirmed: 'Assign a wrapper', assigned: 'Dispatch wrapper', enroute: 'Skip to arrival', arrived: 'Start wrapping', wrapping: 'Finish wrapping' }[b.status];
  return `<div class="screen" style="padding-bottom:calc(24px + var(--safe-b))">
    <div class="mapwrap"><div class="topbar"><a class="iconbtn" href="#/bookings" aria-label="Back">${ic('back')}</a><div class="grow"></div></div>
      ${mapSvg(b)}${nextLabel && !cancelled ? `<button class="demo" data-act="advance" data-id="${b.id}">Demo: ${nextLabel} ›</button>` : ''}</div>
    <div class="sheetpanel"><div class="grab"></div>
      <div class="row between"><div class="grow"><h2 style="font-size:26px">${head[0]}</h2><p class="muted small mt8" id="subhead">${head[1]}</p></div>
        ${b.status === 'enroute' ? `<div class="center"><div class="eta" id="eta">–</div><div class="tiny muted">min</div></div>` : ''}</div>
      ${b.status === 'enroute' ? '<div class="bar"><i id="bar" style="width:0"></i></div>' : '<div class="hline"></div>'}
      ${wrapperShown ? `<div class="row"><div class="avatar">CL</div><div class="grow"><b>${WRAPPER.name}</b>
        <div class="muted small">★ ${WRAPPER.rating} · ${WRAPPER.wraps.toLocaleString()} wraps</div><div class="muted small">${WRAPPER.car}</div></div>
        <button class="iconbtn" data-act="chat" aria-label="Message">${ic('chat')}</button><button class="iconbtn" data-act="call" aria-label="Call">${ic('phone')}</button></div><div class="hline"></div>` : ''}
      ${inprog || b.status === 'done' ? `<div><div class="between row"><b>Gifts wrapped</b><span class="gold" id="gcount">${b.status === 'done' ? b.gifts : 0} / ${b.gifts}</span></div><div class="gifts" id="gifts">${gifts}</div></div><div class="hline"></div>` : ''}
      ${b.status === 'done' ? `<div class="center"><b>Rate ${WRAPPER.name.split(' ')[0]}</b><div class="stars mt8">${[1, 2, 3, 4, 5].map(n => `<button class="${(b.rating || 0) >= n ? 'on' : ''}" data-act="rate" data-id="${b.id}" data-v="${n}" aria-label="${n} stars"><svg viewBox="0 0 24 24">${ICONS.star}</svg></button>`).join('')}</div></div><div class="hline"></div>` : ''}
      ${cancelled ? '' : `<div class="timeline">${STAGES.map((s, i) => `<div class="tl ${i < idx || b.status === 'done' ? 'done' : i === idx ? 'now' : ''}"><i></i>${s.label}</div>`).join('')}</div><div class="hline"></div>`}
      <div class="kv">${ic('gift')}<div class="grow"><b>${p.name}</b><div class="muted small">${b.gifts} gifts · ${esc(b.occasion)} · ${b.id}</div></div><b>${money(b.total)}</b></div>
      <div class="kv">${ic('cal')}<div><b>${b.time === 'asap' ? 'As soon as possible' : dayLong(b.date)}</b><div class="muted small">${b.time === 'asap' ? 'Same-day dispatch' : 'Arrives ' + hourLabel(+b.time)}</div></div></div>
      <div class="kv">${ic('pin')}<div><b>${esc(b.address.line)}</b><div class="muted small">${esc([b.address.unit, b.address.notes].filter(Boolean).join(' · '))}</div></div></div>
      <div class="actions mt16">
        <button class="btn ghost" data-act="ics" data-id="${b.id}">${ic('cal')} Calendar</button>
        ${b.status === 'done' || cancelled ? `<button class="btn ghost" data-act="rebook" data-id="${b.id}">Book again</button>` : `<button class="btn danger" data-act="cancel" data-id="${b.id}">Cancel booking</button>`}</div>
    </div></div>`;
}
function mapSvg(b) {
  const streets = Array.from({ length: 8 }, (_, i) => `<path d="M${i * 60 - 10} 0V360" stroke="#1d1d21" stroke-width="12"/>`).join('') +
    Array.from({ length: 7 }, (_, i) => `<path d="M0 ${i * 55 + 10}H400" stroke="#1d1d21" stroke-width="12"/>`).join('');
  return `<svg class="map" viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice" aria-label="Map"><rect width="400" height="360" fill="#0f0f11"/>
    <rect x="190" y="180" width="90" height="60" rx="10" fill="#10201a"/><path d="M0 70 C120 110 220 20 400 60" stroke="#101c2a" stroke-width="26" fill="none"/>${streets}
    <path d="${ROUTE_D}" stroke="#2c2412" stroke-width="7" fill="none" stroke-linejoin="round"/>
    <path id="route" d="${ROUTE_D}" stroke="#c9a45c" stroke-width="3" fill="none" stroke-linejoin="round" stroke-dasharray="1 7" stroke-linecap="round"/>
    <g transform="translate(330 90)"><circle r="20" fill="#c9a45c" opacity=".18"/><circle r="7" fill="#f4efe6"/></g>
    ${b.status === 'confirmed' || b.status === 'cancelled' ? '' : `<g id="car" transform="translate(50 320)"><circle r="17" fill="#c9a45c"/><g transform="translate(-9 -9) scale(.15)"><path d="M60 0L0 60 60 120 120 60z" fill="none"/></g>
      <path d="M-7 -2h14v9h-14zM-9 -2h18M0 -2v9M0 -2c-5-6-9-1-5 0M0 -2c5-6 9-1 5 0" stroke="#1a1408" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>`}</svg>`;
}

let cleanup = null;
function mountTrack(b) {
  const path = $('#route'), car = $('#car');
  const place = f => { if (!path || !car) return; const L = path.getTotalLength(), pt = path.getPointAtLength(L * f); car.setAttribute('transform', `translate(${pt.x} ${pt.y})`); };
  if (b.status === 'assigned') place(0);
  if (b.status === 'arrived' || b.status === 'wrapping' || b.status === 'done') place(1);
  const timers = [];
  if (b.status === 'enroute') {
    const total = 18000, startFrom = S.sim[b.id] || 0, t0 = performance.now() - startFrom * total;
    const tick = () => {
      const f = Math.min(1, (performance.now() - t0) / total);
      S.sim[b.id] = f; place(f);
      $('#eta') && ($('#eta').textContent = Math.max(1, Math.ceil(12 * (1 - f))));
      $('#bar') && ($('#bar').style.width = f * 100 + '%');
      $('#subhead') && ($('#subhead').textContent = f < .5 ? WRAPPER.car : 'Almost there — look out for her at the door.');
      if (f >= 1) { setStatus(b.id, 'arrived'); push('Camille has arrived'); } else timers.push(requestAnimationFrame(tick));
    };
    tick();
  }
  if (b.status === 'wrapping') {
    const els = [...document.querySelectorAll('#gifts svg')]; let n = 0;
    const iv = setInterval(() => {
      if (n < els.length) { els[n++].classList.add('done'); $('#gcount').textContent = `${Math.round(n / els.length * b.gifts)} / ${b.gifts}`; }
      else { clearInterval(iv); setStatus(b.id, 'done'); push('All wrapped!'); }
    }, 1100);
    timers.push(iv);
  }
  if (b.status === 'done') document.querySelectorAll('#gifts svg').forEach(e => e.classList.add('done'));
  return () => timers.forEach(t => { cancelAnimationFrame(t); clearInterval(t); });
}
function setStatus(id, status) {
  const b = S.bookings.find(x => x.id === id); if (!b) return;
  b.status = status; save();
  if (location.hash === '#/track/' + id) render();
}
function push(msg) { toast('🎁 ' + msg); try { navigator.vibrate && navigator.vibrate(60); } catch { /* ignore */ } }

route(/^track\/([\w-]+)$/, id => {
  const b = S.bookings.find(x => x.id === id);
  if (!b) return { redirect: '#/bookings' };
  return { html: trackView(b), mount: () => mountTrack(b) };
});

/* ---------- Router ---------- */
let current = '';
function render() {
  cleanup && cleanup(); cleanup = null;
  const h = location.hash.replace(/^#\/?/, '');
  for (const [re, fn] of routes) {
    const m = h.match(re); if (!m) continue;
    const r = fn(...m.slice(1));
    if (r.redirect) { location.replace(r.redirect); return; }
    const app = $('#app');
    const keepScroll = h === current;
    const top = app.scrollTop;
    app.innerHTML = r.html;
    if (!keepScroll) { app.style.animation = 'none'; app.offsetHeight; app.style.animation = ''; }
    app.scrollTop = keepScroll ? top : 0;
    current = h;
    if (r.mount) { const c = r.mount(); if (typeof c === 'function') cleanup = c; }
    return;
  }
  location.replace('#/');
}
window.addEventListener('hashchange', () => { closeSheet(); render(); });

/* ---------- Actions ---------- */
const bind = (path, v) => { const parts = path.split('.'); let o = draft(); while (parts.length > 1) o = o[parts.shift()] ||= {}; o[parts[0]] = v; save(); };
const actions = {
  start(el) { if (!S.draft || el.dataset.pkg) S.draft = newDraft(el.dataset.pkg); save(); location.hash = el.dataset.pkg ? '#/customize' : '#/packages'; },
  exit() { S.draft = null; save(); },
  'pick-pkg'(el) { const p = pkgOf(el.dataset.id), d = draft(); d.pkg = p.id; d.gifts = p.incl; save(); render(); },
  gifts(el) { const d = draft(); d.gifts = Math.min(30, Math.max(1, d.gifts + +el.dataset.d)); save(); render(); },
  occasion(el) { draft().occasion = el.dataset.v; save(); render(); },
  palette(el) { draft().palette = el.dataset.id; save(); render(); },
  addon(el) { const d = draft(), i = d.addons.indexOf(el.dataset.id); i < 0 ? d.addons.push(el.dataset.id) : d.addons.splice(i, 1); save(); render(); },
  day(el) { const d = draft(); d.date = el.dataset.v; if (d.time === 'asap' || !slotsFor(d.date).find(s => String(s.h) === d.time && s.free)) d.time = null; save(); render(); },
  slot(el) { draft().time = el.dataset.v; save(); render(); },
  asap() { const d = draft(); d.time = 'asap'; d.date = iso(new Date()); save(); render(); },
  saved(el) { draft().address = { ...SAVED[+el.dataset.i] }; save(); render(); },
  place(el) { draft().address = { label: 'New address', line: el.dataset.v, unit: '' }; save(); render(); },
  locate() { draft().address = { label: 'Current location', line: '350 5th Ave, New York, NY 10118', unit: '' }; save(); toast('Location found'); render(); },
  tip(el) { draft().tip = +el.dataset.v; save(); render(); },
  pay(el) { draft().pay = el.dataset.id; save(); render(); },
  promo() { draft().promo = $('#promo').value.trim(); save(); render(); },
  book() {
    const d = draft(), q = quote(d);
    const b = { id: 'GW-' + String(Math.floor(10000 + Math.random() * 89999)), pkg: d.pkg, gifts: d.gifts, palette: d.palette, occasion: d.occasion, addons: d.addons.slice(),
      note: d.note, date: d.time === 'asap' ? iso(new Date()) : d.date, time: d.time, address: { ...d.address }, total: q.total, status: 'confirmed', createdAt: Date.now(), pay: d.pay };
    S.bookings.unshift(b); S.draft = null; S.bkTab = 'up'; save();
    location.hash = '#/confirmed/' + b.id;
  },
  bktab(el) { S.bkTab = el.dataset.v; save(); render(); },
  advance(el) {
    const b = S.bookings.find(x => x.id === el.dataset.id), i = STAGES.findIndex(s => s.id === b.status);
    if (b.status === 'enroute') S.sim[b.id] = 1;
    setStatus(b.id, STAGES[Math.min(i + 1, STAGES.length - 1)].id);
    if (b.status === 'assigned') push('Camille is your wrapper'); if (b.status === 'enroute') push('Camille is on her way');
  },
  rate(el) { const b = S.bookings.find(x => x.id === el.dataset.id); b.rating = +el.dataset.v; save(); render(); toast('Thanks for the feedback'); },
  call() { toast('Calling Camille… (demo)'); },
  chat() {
    openSheet(`<h3>Message ${WRAPPER.name.split(' ')[0]}</h3><div id="msgs" style="display:grid;gap:8px;margin-bottom:14px"><div class="bubble them">Hello! I’ll be there shortly. Anything I should know?</div></div>
      <div class="chips" style="padding:0 0 12px">${['Buzzer is 5B', 'Please call on arrival', 'Running 5 min late', 'Leave with doorman'].map(t => `<button class="chip" data-act="reply" data-v="${t}">${t}</button>`).join('')}</div>`);
  },
  reply(el) {
    const m = $('#msgs'); m.insertAdjacentHTML('beforeend', `<div class="bubble me">${esc(el.dataset.v)}</div>`);
    setTimeout(() => m && m.insertAdjacentHTML('beforeend', '<div class="bubble them">Perfect, thank you! 🎀</div>'), 900);
  },
  cancel(el) {
    openSheet(`<h3>Cancel this booking?</h3><p class="muted small mb8">Free cancellation up to 24 hours before. Your card won’t be charged.</p>
      <button class="btn danger mt16" data-act="cancel-yes" data-id="${el.dataset.id}">Yes, cancel booking</button><button class="btn ghost mt8" data-act="close">Keep booking</button>`);
  },
  'cancel-yes'(el) { closeSheet(); setStatus(el.dataset.id, 'cancelled'); toast('Booking cancelled'); },
  close() { closeSheet(); },
  rebook(el) {
    const b = S.bookings.find(x => x.id === el.dataset.id), d = newDraft(b.pkg);
    Object.assign(d, { gifts: b.gifts, palette: b.palette, occasion: b.occasion, addons: (b.addons || []).slice(), address: { ...b.address } });
    S.draft = d; save(); location.hash = '#/schedule';
  },
  ics(el) {
    const b = S.bookings.find(x => x.id === el.dataset.id), p = pkgOf(b.pkg);
    const d = fromIso(b.date); d.setHours(b.time === 'asap' ? new Date().getHours() + 1 : +b.time, 0, 0, 0);
    const f = x => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const end = new Date(d.getTime() + p.mins * 60000);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ribbon & Co.//Demo//EN', 'BEGIN:VEVENT', `UID:${b.id}@ribbon.demo`, `DTSTAMP:${f(new Date())}`,
      `DTSTART:${f(d)}`, `DTEND:${f(end)}`, `SUMMARY:Ribbon & Co. — ${p.name}`, `LOCATION:${b.address.line.replace(/,/g, '\\,')}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = b.id + '.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('Calendar event downloaded');
  },
  soon() { toast('Not part of this demo'); },
  reset() {
    openSheet(`<h3>Reset demo?</h3><p class="muted small">This clears every booking you created and restores the sample history.</p>
      <button class="btn mt16" data-act="reset-yes">Reset</button><button class="btn ghost mt8" data-act="close">Cancel</button>`);
  },
  'reset-yes'() { S = seed(); save(); closeSheet(); toast('Demo reset'); location.hash = '#/'; render(); },
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const fn = actions[el.dataset.act]; if (!fn) return;
  if (el.tagName !== 'A') e.preventDefault();
  fn(el, e);
});
document.addEventListener('input', e => { const k = e.target.dataset && e.target.dataset.bind; if (k) bind(k, e.target.value); });

/* ---------- Boot ---------- */
if (!location.hash) location.replace('#/');
render();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { /* offline support optional */ });
