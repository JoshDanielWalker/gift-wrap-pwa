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
  { id: 'maison', name: 'Maison Couture', price: 340, incl: 12, extra: 32, mins: 180, wrappers: 1, badge: 'Couture',
    tag: 'A fully themed, photo-ready gifting experience.',
    feats: ['A dedicated master wrapper for the afternoon', 'Custom monogram & themed styling', 'Fabric furoshiki wraps', 'Gift-table styling & photo set'] },
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
  { id: 'card', name: 'Handwritten note card', desc: 'Your message, penned by your wrapper', price: 12 },
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
];
const WALLET = { id: 'apple', name: 'Apple Pay', logo: 'PAY' };
const DEMO_EMAIL = 'josh.d.walker@me.com';
const WRAPPER = { name: 'Camille Laurent', rating: 4.98, wraps: 1240, car: 'Black Tesla Model Y · LUX 482', bio: 'Trained in Paris. Loves a perfect corner.' };
const STAGES = [
  { id: 'confirmed', label: 'Confirmed', long: 'Confirmed' },
  { id: 'assigned', label: 'Order prepared', long: 'Camille is preparing' },
  { id: 'today', label: 'Day of service', long: 'Camille is on her way' },
  { id: 'done', label: 'Complete', long: 'Completed' },
];
const GIFT_TYPES = ['Box', 'Bottle', 'Jewellery', 'Book', 'Clothing', 'Toy', 'Awkward shape'];
const RITUAL = [
  ['Arrival & consultation', 'Your wrapper greets you, confirms your palette and reviews each gift.'],
  ['The wrapping', 'Every gift is measured, cut and finished by hand at your own table.'],
  ['Final inspection & tidy', 'A last check of each bow and corner. All offcuts leave with us.'],
];
const FAQ = [
  ['What do you bring with you?', 'Everything: paper, ribbon, boxes, tags, tools and a protective work mat. You only need a clear table.'],
  ['What if I have more gifts than my package includes?', 'Add extra gifts on the next step for a small per-gift charge. Your wrapper can also adapt on the day.'],
  ['Can I change or cancel my appointment?', 'Yes. Rescheduling and cancellation are free up to 24 hours before your appointment.'],
  ['Is your wrapper insured and vetted?', 'Camille is background-checked, trained in Paris and covered by our liability insurance.'],
  ['Why is availability limited?', 'Every appointment is wrapped personally by Camille, so we take a small number each day. Closed days and fully booked days can be joined on a waiting list.'],
  ['Do you offer same-day?', 'When Camille has an opening today, the earliest time is offered at the top of the schedule for a $15 priority fee.'],
  ['Do you wrap awkward shapes?', 'Absolutely: bottles, framed art, instruments, bicycles. Our Bespoke gift box add-on is made to measure.'],
  ['Is gratuity included?', 'It isn’t. Tipping is optional and goes entirely to your wrapper.'],
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
const durLabel = m => (m >= 60 ? Math.floor(m / 60) + ' hr' + (m % 60 ? ' ' + (m % 60) + ' min' : '') : m + ' min');
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
  gem: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M10 3L8 9l4 12M14 3l2 6-4 12"/>',
  reset: '<path d="M4 4v6h6M4.5 15a8 8 0 100-6"/>', star: '<path d="M12 2l3 7 7.5.6-5.7 5 1.8 7.4L12 18l-6.6 4 1.8-7.4-5.7-5L9 9z"/>',
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;

/** Illustrated gift box, coloured by palette. */
function gift(palId, size) {
  const p = palOf(palId);
  return `<svg class="gift" viewBox="0 0 120 120" ${size ? `width="${size}" height="${size}"` : ''} aria-hidden="true">
    <ellipse cx="60" cy="108" rx="40" ry="5" fill="#000" opacity=".12"/>
    <rect x="18" y="56" width="84" height="48" rx="4" fill="${p.paper}" stroke="${p.rib}" stroke-opacity=".5"/>
    <rect x="12" y="42" width="96" height="20" rx="4" fill="${p.paper}" stroke="${p.rib}" stroke-opacity=".7"/>
    <rect x="53" y="42" width="14" height="62" fill="${p.rib}"/><rect x="12" y="48" width="96" height="6" fill="${p.rib}" opacity=".0"/>
    <path d="M60 42C40 42 26 32 34 21c7-8 22 2 26 21zM60 42c20 0 34-10 26-21-7-8-22 2-26 21z" fill="none" stroke="${p.rib}" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="60" cy="42" r="5" fill="${p.rib}"/></svg>`;
}

/* ---------- State ---------- */
const KEY = 'ribbon-demo-v3', ACC_KEY = 'ribbon-accounts-v1';
const DEFAULT_PREFS = () => ({ sms: true, email: true, holiday: false, occ: true });
/** A visitor starts as a guest: nothing saved, nothing required. */
const guestState = () => ({ user: null, contact: { name: '', email: '', phone: '' }, draft: null, bookings: [], occasions: [], saved: [], cards: [], giftcards: [],
  prefs: DEFAULT_PREFS(), waitlist: {}, bkTab: 'up' });
const plusDays = n => { const x = new Date(); x.setDate(x.getDate() + n); return x; };
/** Sample remembered occasions, dated relative to today so the demo always has something upcoming. */
function demoOccasions() {
  const at = (n, yearsBack) => { const x = plusDays(n); x.setFullYear(x.getFullYear() - (yearsBack || 0)); return iso(x); };
  const snap = (daysAgo, pkg, gifts, palette, addons, items) => ({ date: iso(plusDays(-daysAgo)), pkg, gifts, palette, addons, items, address: { ...SAVED[0] }, total: 124.4 });
  return [
    { id: 'o-mum', kind: 'Birthday', who: 'Mum', date: at(12, 70), history: [snap(353, 'signature', 4, 'ivory', ['calli'], [{ who: 'Mum', what: 'Jewellery' }])] },
    { id: 'o-ann', kind: 'Anniversary', who: 'James & Josh', date: at(52, 25), history: [snap(313, 'atelier', 3, 'emerald', ['flora', 'seal'], [])] },
    { id: 'o-ele', kind: 'Birthday', who: 'Eleanor', date: at(150), history: [snap(215, 'classic', 3, 'blush', [], [])] },
  ];
}
/** The demo "returning client": sample history that loads when signing in as the demo account. */
function returningClient() {
  const d = new Date(); d.setDate(d.getDate() - 21);
  const d2 = new Date(); d2.setDate(d2.getDate() - 70);
  const mk = (id, pkg, gifts, pal, date, time, addr, total) => ({
    id, pkg, gifts, palette: pal, occasion: 'Birthday', addons: [], note: '', cardmsg: '', date: iso(date), time, address: addr, total, status: 'done', rating: 5,
    createdAt: date.getTime() - 86400000 * 3, pay: 'visa', contact: { name: 'Josh Walker', email: DEMO_EMAIL, phone: '(212) 555-0142' },
  });
  return { bookings: [mk('GW-48211', 'signature', 4, 'ivory', d, '14', { ...SAVED[0] }, 124.4), mk('GW-39027', 'classic', 3, 'noir', d2, '11', { ...SAVED[1] }, 71.8)],
    saved: SAVED.map(a => ({ ...a })), cards: PAYMENTS.map(p => ({ ...p })), occasions: demoOccasions() };
}
let S, ACC;
try { S = JSON.parse(localStorage.getItem(KEY)) || guestState(); } catch { S = guestState(); }
try { ACC = JSON.parse(localStorage.getItem(ACC_KEY)) || {}; } catch { ACC = {}; }
const ACCT_FIELDS = ['user', 'contact', 'bookings', 'occasions', 'saved', 'cards', 'giftcards', 'prefs', 'waitlist'];
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
    if (S.user) { ACC[S.user.email] = Object.fromEntries(ACCT_FIELDS.map(k => [k, S[k]])); localStorage.setItem(ACC_KEY, JSON.stringify(ACC)); }
  } catch { /* private mode */ }
};
const initials = n => (n || '?').split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
const firstName = () => (S.user?.name || S.contact.name || '').split(' ')[0];
const nameFromEmail = e => e.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
/** Passwordless: creates the account from details already given at checkout. */
function createAccount({ name, email, phone }) {
  email = email.trim().toLowerCase();
  if (ACC[email]) return signIn(email);
  S.user = { name: name.trim(), email, phone: phone || '', since: Date.now() };
  S.contact = { name: S.user.name, email, phone: S.user.phone }; save();
}
function signIn(email) {
  email = email.trim().toLowerCase();
  const guestBookings = S.user ? [] : S.bookings, guestOcc = S.user ? [] : S.occasions, draft = S.draft;
  const acct = ACC[email] || (email === DEMO_EMAIL
    ? { ...guestState(), ...returningClient(), user: { name: 'Josh Walker', email, phone: '(212) 555-0142', since: Date.now() - 86400000 * 120 } }
    : { ...guestState(), user: { name: nameFromEmail(email), email, phone: S.contact.phone || '', since: Date.now() } });
  S = { ...guestState(), ...acct, draft, bkTab: 'up' };
  S.bookings = [...guestBookings, ...(acct.bookings || [])];
  S.occasions = [...guestOcc, ...(acct.occasions || [])];
  S.contact = { name: S.user.name, email, phone: S.user.phone || '' }; save();
}
function signOut() { save(); S = guestState(); save(); }
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((e || '').trim());
const contactOk = () => S.contact.name.trim().length >= 2 && validEmail(S.contact.email) && S.contact.phone.replace(/\D/g, '').length >= 10;

function firstOpenDate(mins = 75, ign) {
  for (let i = 0; i < 60; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    if (openCount(iso(d), mins, ign)) return iso(d);
  }
  return iso(new Date());
}
function newDraft(pkgId) {
  const p = pkgOf(pkgId || 'signature');
  return { pkg: p.id, gifts: p.incl, occasion: 'Birthday', palette: 'noir', addons: [], note: '', cardmsg: '', items: [], photos: [], remember: false, remWho: '', remDate: '', occId: null, perk: false, date: firstOpenDate(p.mins), time: null,
    address: null, promo: '', tip: 0.1, pay: S.cards[0]?.id || WALLET.id };
}
const draft = () => S.draft || (S.draft = newDraft());

/* ---------- Pricing & availability ---------- */
function quote(d) {
  const p = pkgOf(d.pkg);
  const extra = Math.max(0, d.gifts - p.incl) * p.extra;
  const addons = d.addons.reduce((a, id) => a + ADDONS.find(x => x.id === id).price, 0);
  const asap = d.date === iso(new Date()) ? ASAP_FEE : 0;
  const base = p.price + extra + addons;
  const rate = PROMOS[(d.promo || '').toUpperCase()] || 0;
  const discount = base * rate;
  const perk = d.perk && d.addons.includes('seal') ? ADDONS.find(a => a.id === 'seal').price : 0;
  const taxable = base - discount - perk + asap + SERVICE_FEE;
  const tax = taxable * TAX;
  const tip = (p.price + extra) * (d.tip || 0);
  return { p, extra, addons, asap, base, discount, perk, fee: SERVICE_FEE, tax, tip, total: taxable + tax + tip };
}
const OPEN_H = 9, CLOSE_H = 20, BUFFER = 30, LEAD_MIN = 90;
/** Appointment length: package time plus 8 min for each gift beyond those included. */
const durMins = d => { const p = pkgOf(d.pkg); return Math.ceil((p.mins + Math.max(0, d.gifts - p.incl) * 8) / 15) * 15; };
/** Camille is our only wrapper: closed Sundays, plus the occasional private-commission day. */
const dayOff = k => fromIso(k).getDay() === 0 || hash(k + 'off') % 13 === 0;
/** Deterministic mock of other clients' appointments, as [startMin, endMin]. */
function otherBookings(k) {
  let seed = hash(k); const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const n = [3, 4, 4, 5, 2, 4, 5][seed % 7], out = [];
  for (let i = 0; i < n; i++) { const st = (OPEN_H + Math.floor(rnd() * 10)) * 60; out.push([st, st + [60, 75, 90, 120][Math.floor(rnd() * 4)]]); }
  return out;
}
function busyOn(k, ignoreId) {
  const own = S.bookings.filter(b => b.date === k && b.status !== 'cancelled' && b.id !== ignoreId && b.time != null)
    .map(b => [+b.time * 60, +b.time * 60 + (b.mins || pkgOf(b.pkg).mins)]);
  return otherBookings(k).concat(own);
}
function slotsFor(k, mins, ignoreId) {
  if (dayOff(k)) return Array.from({ length: CLOSE_H - OPEN_H }, (_, i) => ({ h: OPEN_H + i, free: false }));
  const now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes(), today = iso(now) === k, busy = busyOn(k, ignoreId), out = [];
  for (let h = OPEN_H; h < CLOSE_H; h++) {
    const st = h * 60, en = st + mins;
    const free = en <= CLOSE_H * 60 && !(today && st < nowMin + LEAD_MIN) && !busy.some(([a, b]) => st < b + BUFFER && en > a - BUFFER);
    out.push({ h, free });
  }
  return out;
}
const openCount = (k, mins, ign) => slotsFor(k, mins, ign).filter(s => s.free).length;
const dayState = (k, mins, ign) => dayOff(k) ? 'off' : ({ 0: 'full', 1: 'few', 2: 'few', 3: 'few' }[openCount(k, mins, ign)] || 'open');
function nextOpenDate(from, mins, ign) {
  for (let i = 1; i <= 60; i++) { const x = fromIso(from); x.setDate(x.getDate() + i); if (openCount(iso(x), mins, ign)) return iso(x); }
  return null;
}
const earliestToday = (mins, ign) => slotsFor(iso(new Date()), mins, ign).find(s => s.free);
/** Drop the chosen time if a later change (gift count, package) means it no longer fits Camille's day. */
const timeStillFree = d => !d.time || slotsFor(d.date, durMins(d), d.resched).some(s => String(s.h) === d.time && s.free);

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
  return `<nav class="tabs">${t('', 'home', 'Home')}${t('occasions', 'gem', 'Occasions')}${t('bookings', 'cal', 'Bookings')}${t('account', 'user', 'Account')}</nav>`;
}
const STEPS = ['packages', 'customize', 'schedule', 'address', 'review'];
function flow(step, title, sub, body, cta) {
  const d = draft(), q = quote(d);
  const back = d.resched ? '#/track/' + d.resched : step === 0 ? '#/' : '#/' + STEPS[step - 1];
  return `<div class="screen">
    <div class="topbar"><a class="iconbtn" href="${back}" aria-label="Back">${ic('back')}</a>
      <div class="grow tiny muted">${d.resched ? 'Reschedule ' + d.resched : `Step ${step + 1} of ${STEPS.length}`}</div>
      <a class="iconbtn" href="#/" data-act="exit" aria-label="Close">${ic('close')}</a></div>
    ${d.resched ? '' : `<div class="progress">${STEPS.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>`}
    <h1 class="title">${title}</h1><p class="sub">${sub}</p>${body}
    <div class="cta">${step > 0 && !d.resched ? `<div class="total"><span>Estimated total</span><b>${money(q.total)}</b></div>` : ''}${cta}</div></div>`;
}

/* ---------- Screens ---------- */
const routes = [];
const route = (re, fn) => routes.push([re, fn]);

/** The soonest remembered occasion inside the reminder window, unless snoozed or switched off. */
function letterFor() {
  if (S.prefs.occ === false) return '';
  const hit = S.occasions.map(o => [o, nextOcc(o)]).filter(([o, n]) => n.days <= 60 && !(o.snooze && o.snooze > iso(new Date()))).sort((a, b) => a[1].days - b[1].days)[0];
  if (hit) return occLetter(hit[0]);
  return !S.occasions.length && S.bookings.length ? `<div class="pad mt24"><a class="card row" href="#/occasions" style="border-color:var(--gold2)">${ic('gem')}<div class="grow small"><b>Let us remember for you</b><div class="muted">Tell us the dates that matter and Camille will write ahead each year.</div></div>${ic('chev')}</a></div>` : '';
}
route(/^$/, () => {
  const up = S.bookings.filter(b => b.status !== 'done' && b.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date))[0];
  const last = S.bookings.filter(b => b.status === 'done').sort((a, b) => b.date.localeCompare(a.date))[0];
  return { tab: '', html: `<div class="screen">
    <div class="hero ${S.user && S.bookings.length ? 'compact' : ''}"><div class="brand">Ribbon &amp; Co.<small>GIFT WRAPPING ATELIER</small></div>
      <h1>The art of<br><em>giving,</em> perfected.</h1>
      <p class="muted">Camille, our master wrapper, comes to your home or office and dresses every gift as if it were jewellery.</p>
      ${S.user && S.bookings.length ? '' : `<div class="heroart">${gift('ivory')}</div>`}
      <button class="btn" data-act="start">Book an appointment</button>
      <p class="tiny muted mt16">Manhattan · Brooklyn · Limited daily availability</p></div>
    ${installCard()}
    ${up ? `<span class="tiny eyebrow">Your next appointment</span><div class="stack mt8">${bookingCard(up)}</div>` : ''}
    ${letterFor()}
    ${last ? `<div class="sec"><h3>Wrap again</h3></div><div class="stack"><button class="bk" data-act="rebook" data-id="${last.id}">${gift(last.palette)}<div class="grow"><b style="font-family:var(--serif);font-size:22px;font-weight:500">${pkgOf(last.pkg).name}</b>
      <div class="muted small">${last.gifts} gifts · ${palOf(last.palette).name} · ${money(last.total)}</div><span class="link">Book the same again</span></div></button></div>` : ''}
    <div class="sec"><h3>The collection</h3><a class="link" href="#/packages">View all</a></div>
    <div class="pkgrow">${PACKAGES.map((p, i) => `<button class="mini" data-act="start" data-pkg="${p.id}">
      ${gift(PALETTES[[1, 0, 3, 2][i]].id)}<b>${p.name}</b><span class="muted small">From ${money(p.price)}</span></button>`).join('')}</div>
    <div class="stack mt24"><button class="season" data-act="start" data-pkg="signature"><span class="tiny">The holiday season</span><b>Reserve your December appointments</b>
      <span class="small">Peak dates fill early. Book now for a Signature wrapping from ${money(95)}.</span></button></div>
    <div class="sec"><h3>How it works</h3></div>
    <div class="how"><div><i>I</i><span><b>Select your package</b><span class="muted small">Choose a finish, your palette and any finishing touches.</span></span></div>
      <div><i>II</i><span><b>Reserve your time</b><span class="muted small">Pick a day and arrival time, share where we should come.</span></span></div>
      <div><i>III</i><span><b>We arrive, you relax</b><span class="muted small">Your wrapper brings every material and leaves nothing behind.</span></span></div></div>
    <div class="sec"><h3>Our promise</h3></div>
    <div class="perks"><div>${ic('sparkle')}<br>Master wrapper</div><div>${ic('bolt')}<br>By appointment</div><div>${ic('shield')}<br>Insured &amp; vetted</div></div>
    <div class="sec"></div><p class="quote">“I handed over a pile of boxes and an hour later it looked like a boutique window.”<span>Eleanor · Upper West Side</span></p>
  </div>${tabbar('')}` };
});

route(/^packages$/, () => {
  const d = draft();
  return { html: flow(0, 'Select your<br>package', 'Every package includes materials, a professional wrapper and cleanup.',
    `<div class="stack">${PACKAGES.map((p, i) => `<div><button class="pkg ${d.pkg === p.id ? 'on' : ''}" data-act="pick-pkg" data-id="${p.id}">
      <div class="art">${gift(PALETTES[[1, 0, 3, 2][i]].id)}</div>
      <span class="badge">${p.badge}</span><div class="row between"><h3>${p.name}</h3><div class="price">${money(p.price)}</div></div>
      <div class="muted small">${p.incl} gifts included · approx. ${p.mins >= 120 ? p.mins / 60 + ' hours' : p.mins + ' minutes'}${p.wrappers > 1 ? ' · two wrappers' : ''}</div>
      <p class="muted small mt8">${p.tag}</p>
      <ul class="feat">${p.feats.map(f => `<li>${ic('check')}${f}</li>`).join('')}</ul></button>
      <div class="center mt8"><button class="link" data-act="pkg-info" data-id="${p.id}">View details &amp; the ritual</button></div></div>`).join('')}</div>`,
    `<a class="btn" href="#/customize">Continue with ${pkgOf(d.pkg).name}</a>`) };
});

route(/^customize$/, () => {
  const d = draft(), p = pkgOf(d.pkg);
  return { html: flow(1, 'Make it yours', `${p.name} · ${p.incl} gifts included, extra gifts ${money(p.extra)} each.`,
    `<div class="pad"><div class="card row between"><div><b>Number of gifts</b><div class="muted small">${d.gifts > p.incl ? `+${money((d.gifts - p.incl) * p.extra)} for ${d.gifts - p.incl} extra` : 'Included in package'}</div></div>
      <div class="stepper"><button data-act="gifts" data-d="-1" ${d.gifts <= 1 ? 'disabled' : ''} aria-label="Fewer">${ic('minus')}</button><b>${d.gifts}</b>
      <button data-act="gifts" data-d="1" ${d.gifts >= 30 ? 'disabled' : ''} aria-label="More">${ic('plus')}</button></div></div></div>
    <div class="sec"><h3>Occasion</h3></div><div class="chips">${OCCASIONS.map(o => `<button class="chip ${d.occasion === o ? 'on' : ''}" data-act="occasion" data-v="${o}">${o}</button>`).join('')}</div>
    ${traditionBlock(d)}
    <div class="sec"><h3>Palette</h3></div><div class="swatches">${PALETTES.map(p => `<button class="sw ${d.palette === p.id ? 'on' : ''}" data-act="palette" data-id="${p.id}">
      <i style="background:${p.paper};--rib:${p.rib}"></i>${p.name}</button>`).join('')}</div>
    <div class="sec"><h3>Enhancements</h3></div><div class="stack">${ADDONS.map(a => `<button class="opt ${d.addons.includes(a.id) ? 'on' : ''}" data-act="addon" data-id="${a.id}">
      <span class="check">${ic('check')}</span><span class="grow"><b>${a.name}</b><span class="muted small" style="display:block">${a.desc}</span></span><span class="gold">+${money(a.price)}</span></button>`).join('')}</div>
    ${d.addons.includes('card') ? `<div class="sec"><h3>Your card message</h3></div><div class="pad"><label class="field"><span>Written by hand</span>
      <textarea rows="3" maxlength="160" data-bind="cardmsg" placeholder="Happy birthday, Mum. With all my love, J x">${esc(d.cardmsg)}</textarea></label></div>` : ''}
    <div class="sec"><h3>Your gifts</h3><span class="muted small">Optional</span></div>
    <div class="pad"><p class="muted small mb8">Tell Camille what she’ll be wrapping so she arrives with the right boxes and paper.</p>
      <div style="display:grid;gap:10px;grid-template-columns:minmax(0,1fr)">${d.items.map((it, i) => `<div class="card" style="padding:12px"><div class="row"><label class="field grow" style="padding:8px 12px"><span>For</span><input data-bind="items.${i}.who" value="${esc(it.who)}" placeholder="Recipient"></label>
        <button class="iconbtn" data-act="item-del" data-i="${i}" aria-label="Remove gift">${ic('close')}</button></div>
        <div class="chips mt8" style="padding:0">${GIFT_TYPES.map(t => `<button class="chip ${it.what === t ? 'on' : ''}" data-act="item-type" data-i="${i}" data-v="${t}">${t}</button>`).join('')}</div></div>`).join('')}
      ${d.items.length < d.gifts ? `<button class="btn ghost sm" style="width:100%" data-act="item-add">${ic('plus')} Add a gift (${d.items.length} of ${d.gifts})</button>` : ''}</div></div>
    <div class="sec"><h3>Show us your gifts</h3><span class="muted small">Optional</span></div>
    <div class="pad"><div class="photos">${d.photos.map((p, i) => `<div class="ph"><img src="${p}" alt="Gift photo ${i + 1}"><button data-act="photo-del" data-i="${i}" aria-label="Remove photo">${ic('close')}</button></div>`).join('')}
      ${d.photos.length < 3 ? `<label class="ph add"><input id="photo" type="file" accept="image/*" hidden>${ic('plus')}<span class="tiny">Add photo</span></label>` : ''}</div>
      <p class="muted small mt8">A quick photo helps us bring the right size of paper and boxes.</p></div>
    <div class="sec"><h3>Notes for your wrapper</h3></div><div class="pad"><label class="field"><span>Optional</span>
      <textarea rows="3" data-bind="note" placeholder="Fragile items, recipient names for tags, themes…">${esc(d.note)}</textarea></label></div>`,
    `<a class="btn" href="#/schedule">Choose date &amp; time</a>`) };
});

route(/^schedule$/, () => {
  const d = draft(), mins = durMins(d), ign = d.resched;
  if (!timeStillFree(d)) d.time = null;
  const days = Array.from({ length: 21 }, (_, i) => { const x = new Date(); x.setDate(x.getDate() + i); return x; });
  const todayK = iso(new Date()), slots = slotsFor(d.date, mins, ign), open = slots.filter(s => s.free).length;
  const early = d.resched ? null : earliestToday(mins, ign), nextK = open ? null : nextOpenDate(d.date, mins, ign);
  const wl = (S.waitlist || {})[d.date];
  const flag = k => ({ off: 'Closed', full: 'Full', few: 'Few left' }[dayState(k, mins, ign)]);
  return { html: flow(2, d.resched ? 'Choose a<br>new time' : 'When should we<br>arrive?', 'Camille, our resident wrapper, takes a limited number of appointments each day.',
    `${early ? `<div class="pad mb8"><button class="asap ${d.date === todayK && d.time === String(early.h) ? 'on' : ''}" data-act="asap"><span class="bolt">${ic('bolt')}</span>
      <span class="grow"><b>Next available today · ${hourLabel(early.h)}</b><span class="muted small" style="display:block">Same-day priority · +${money(ASAP_FEE)}</span></span>${d.date === todayK && d.time === String(early.h) ? `<span class="check on">${ic('check')}</span>` : ''}</button></div>` : ''}
    <div class="sec"><h3>Pick a day</h3><span class="muted small">Allow ${durLabel(mins)}</span></div>
    <div class="days">${days.map(x => { const k = iso(x), f = flag(k); return `<button class="day ${d.date === k ? 'on' : ''} ${f ? 'flag' : ''}" data-act="day" data-v="${k}">
      <small>${x.toLocaleDateString('en-US', { weekday: 'short' })}</small><b>${x.getDate()}</b><small>${f || x.toLocaleDateString('en-US', { month: 'short' })}</small></button>`; }).join('')}</div>
    <div class="sec"><h3>${d.date === todayK ? 'Today' : dayShort(d.date)}</h3><span class="muted small">${open ? open + ' time' + (open > 1 ? 's' : '') + ' open' : dayOff(d.date) ? 'Closed' : 'Fully booked'}</span></div>
    ${open ? `<div class="slots">${slots.map(s => `<button class="slot ${d.time === String(s.h) ? 'on' : ''}" ${s.free ? '' : 'disabled'} data-act="slot" data-v="${s.h}">${hourLabel(s.h)}</button>`).join('')}</div>
      ${d.date === todayK ? `<p class="small muted pad mt16">Same-day appointments include a ${money(ASAP_FEE)} priority fee.</p>` : ''}`
      : `<div class="pad"><div class="card center"><b style="font-family:var(--serif);font-size:21px;font-weight:500">${dayOff(d.date) ? 'Camille is away this day' : 'Camille is fully booked'}</b>
        <p class="muted small mt8">${dayOff(d.date) ? 'We’re closed on Sundays and occasional private-commission days.' : 'Every appointment is wrapped personally, so we can’t add more on this date.'}</p>
        <div class="mt16" style="display:grid;gap:10px">${nextK ? `<button class="btn" data-act="day" data-v="${nextK}">Next opening · ${dayShort(nextK)}</button>` : ''}
        <button class="btn ghost" data-act="waitlist" data-v="${d.date}">${wl ? 'On the waiting list ✓' : 'Notify me if a time opens'}</button></div></div></div>`}`,
    d.resched ? `<button class="btn" ${d.time ? '' : 'disabled'} data-act="resched-save">${d.time ? 'Move to ' + dayShort(d.date) + ', ' + hourLabel(+d.time) : 'Select a time'}</button>` :
    `<a class="btn" ${d.time ? 'href="#/address"' : 'disabled'}>${d.time ? 'Confirm ' + dayShort(d.date) + ', ' + hourLabel(+d.time) : 'Select a time'}</a>`) };
});

route(/^address$/, () => {
  const d = draft(), a = d.address;
  return { html: flow(3, 'Where are we<br>wrapping?', 'Share the address and any access details for your wrapper.',
    `<div class="searchbox">${ic('search')}<input id="q" placeholder="Search address" autocomplete="off" aria-label="Search address"></div>
    <div class="pad" id="results"></div>
    <div class="pad"><button class="sugg" data-act="locate"><span class="pin">${ic('pin')}</span><span class="grow"><b>Use current location</b><span class="muted small" style="display:block">Demo: uses a sample address</span></span></button></div>
    ${S.saved.length ? `<div class="sec"><h3>Saved places</h3><a class="link" href="#/addresses">Manage</a></div>` : ''}<div class="pad">${S.saved.map((s, i) => `<button class="sugg ${a && a.line === s.line ? 'on' : ''}" data-act="saved" data-i="${i}">
      <span class="pin">${ic(i ? 'cal' : 'home')}</span><span class="grow"><b>${s.label}</b><span class="muted small" style="display:block">${s.line}</span></span></button>`).join('')}</div>
    ${a ? `<div class="sec"><h3>Details</h3></div><div class="stack"><div class="card row">${ic('pin')}<div class="grow"><b>${esc(a.label || 'Selected address')}</b><div class="muted small">${esc(a.line)}</div><div class="okline mt8">${ic('check')} Within our service area</div></div></div>
      <label class="field"><span>Apt / suite / floor</span><input data-bind="address.unit" value="${esc(a.unit || '')}" placeholder="Apt 5B"></label>
      <label class="field"><span>Access instructions</span><textarea rows="2" data-bind="address.notes" placeholder="Doorman, buzzer code, parking…">${esc(a.notes || '')}</textarea></label></div>` : ''}`,
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

route(/^review$/, () => {
  const d = draft(), q = quote(d);
  const pal = palOf(d.palette);
  if (![WALLET, ...S.cards].some(c => c.id === d.pay)) d.pay = S.cards[0]?.id || WALLET.id;
  if (!timeStillFree(d)) { d.time = null; toast('That time is no longer available'); }
  const invalid = !d.address ? 'address' : !d.time ? 'schedule' : null;
  if (invalid) return { redirect: '#/' + invalid };
  const promoOk = PROMOS[(d.promo || '').toUpperCase()];
  return { html: flow(4, 'Review &amp; book', 'Nothing is charged until your wrapper completes the job.',
    `<div class="pad"><div class="card"><div class="row">${gift(d.palette, 64)}<div class="grow"><h3>${q.p.name}</h3>
      <div class="muted small">${d.gifts} gifts · ${d.occasion} · ${pal.name}</div></div><a class="link" href="#/customize">Edit</a></div>
      <div class="hline"></div>
      <div class="kv">${ic('cal')}<div class="grow"><b>${dayLong(d.date)}</b><div class="muted small">${'Arrives ' + hourLabel(+d.time)}</div></div><a class="link" href="#/schedule">Edit</a></div>
      <div class="kv">${ic('pin')}<div class="grow"><b>${esc(d.address.line)}</b><div class="muted small">${esc([d.address.unit, d.address.notes].filter(Boolean).join(' · ') || 'No extra details')}</div></div><a class="link" href="#/address">Edit</a></div></div></div>
    <div class="sec"><h3>Your details</h3>${S.user ? '' : `<a class="link" data-act="signin">Already a client? Sign in</a>`}</div>
    <div class="pad">${S.user ? `<div class="card row"><div class="avatar">${initials(S.user.name)}</div><div class="grow"><b>${esc(S.user.name)}</b><div class="muted small">${esc(S.user.email)}</div><div class="muted small">${esc(S.user.phone || S.contact.phone)}</div></div>${ic('check')}</div>` : `
      <div class="actions"><button class="btn ghost sm" data-act="social" data-v="Apple">Continue with Apple</button><button class="btn ghost sm" data-act="social" data-v="Google">Continue with Google</button></div>
      <p class="tiny muted center" style="margin:14px 0">or check out as a guest</p>
      <div style="display:grid;gap:10px"><label class="field"><span>Full name</span><input data-bind="contact.name" value="${esc(S.contact.name)}" autocomplete="name" placeholder="Josh Walker"></label>
      <label class="field"><span>Email</span><input data-bind="contact.email" type="email" inputmode="email" autocomplete="email" value="${esc(S.contact.email)}" placeholder="you@example.com"></label>
      <label class="field"><span>Mobile</span><input data-bind="contact.phone" type="tel" inputmode="tel" autocomplete="tel" value="${esc(S.contact.phone)}" placeholder="(212) 555-0142"></label></div>
      <p class="muted small mt8">Used only for your booking and a text when Camille is on her way. No account needed.</p>`}</div>
    <div class="sec"><h3>Tip your wrapper</h3></div><div class="pad"><div class="tips">${[0, .1, .15, .2].map(t => `<button class="${d.tip === t ? 'on' : ''}" data-act="tip" data-v="${t}">${t ? t * 100 + '%' : 'None'}</button>`).join('')}</div></div>
    <div class="sec"><h3>Payment</h3></div><div class="stack">${[WALLET, ...S.cards].map(p => `<button class="pay ${d.pay === p.id ? 'on' : ''}" data-act="pay" data-id="${p.id}"><span class="cardlogo">${p.logo}</span>
      <span class="grow">${p.name}</span><span class="check ${d.pay === p.id ? 'on' : ''}">${ic('check')}</span></button>`).join('')}
      <button class="pay" data-act="card-add"><span class="cardlogo">${ic('plus')}</span><span class="grow">Add a payment method</span></button></div>
    <div class="sec"><h3>Promo code</h3></div><div class="pad row"><label class="field grow"><span>Code</span><input id="promo" value="${esc(d.promo)}" placeholder="Try WRAP10" autocapitalize="characters"></label>
      <button class="btn sm ghost" data-act="promo">Apply</button></div>
    ${d.promo ? `<p class="small pad mt8 ${promoOk ? 'gold' : ''}" style="${promoOk ? '' : 'color:var(--danger)'}">${promoOk ? `${promoOk * 100}% off applied` : 'That code isn’t valid'}</p>` : ''}
    <div class="sec"><h3>Summary</h3></div><div class="pad"><div class="card sum">
      <div class="line"><span>${q.p.name}</span><span>${money(q.p.price)}</span></div>
      ${q.extra ? `<div class="line"><span>${d.gifts - q.p.incl} extra gifts</span><span>${money(q.extra)}</span></div>` : ''}
      ${d.addons.map(id => { const a = ADDONS.find(x => x.id === id); return `<div class="line"><span>${a.name}</span><span>${money(a.price)}</span></div>`; }).join('')}
      ${q.asap ? `<div class="line"><span>Same-day priority</span><span>${money(q.asap)}</span></div>` : ''}
      ${q.perk ? `<div class="line disc"><span>Complimentary wax seal</span><span>−${money(q.perk)}</span></div>` : ''}
      ${q.discount ? `<div class="line disc"><span>Promo ${esc(d.promo.toUpperCase())}</span><span>−${money(q.discount)}</span></div>` : ''}
      <div class="line"><span>Service fee</span><span>${money(q.fee)}</span></div>
      <div class="line"><span>Tax</span><span>${money(q.tax)}</span></div>
      ${q.tip ? `<div class="line"><span>Tip</span><span>${money(q.tip)}</span></div>` : ''}
      <div class="line tot"><span>Total</span><span>${money(q.total)}</span></div></div></div>
    <p class="muted small pad mt16">Free cancellation up to 24 hours before your appointment.</p>`,
    `<button class="btn" id="bookbtn" ${contactOk() ? '' : 'disabled'} data-act="book">${contactOk() ? 'Book · ' + money(q.total) : 'Add your details to book'}</button>`) };
});

/* ---------- Install (PWA) ---------- */
let deferredInstall = null;
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const installDismissed = () => { try { return localStorage.getItem('ribbon-install-off') === '1'; } catch { return false; } };
function installCard(flat) {
  if (standalone() || installDismissed() || !(deferredInstall || isIOS())) return '';
  return `<div class="${flat ? '' : 'pad '}mt16"><div class="card row" style="border-color:var(--gold2)"><img src="icons/icon-192.png" alt="" width="44" height="44" style="border-radius:10px">
    <div class="grow small"><b>Add Ribbon &amp; Co. to your home screen</b><div class="muted">${deferredInstall ? 'Book in a tap, even offline.' : 'Tap <b>Share</b>, then <b>Add to Home Screen</b>.'}</div></div>
    ${deferredInstall ? '<button class="btn sm" data-act="install">Install</button>' : ''}<button class="iconbtn" style="width:32px;height:32px" data-act="install-dismiss" aria-label="Dismiss">${ic('close')}</button></div></div>`;
}
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; if (/^(account)?$/.test(location.hash.replace(/^#\/?/, ''))) render(); });
window.addEventListener('appinstalled', () => { deferredInstall = null; toast('Installed. Find us on your home screen.'); render(); });

function occConfirm(b) {
  const o = b.occId && S.occasions.find(x => x.id === b.occId); if (!o) return '';
  const nx = nextOcc(o), yrs = (o.history || []).length;
  return `<div class="letter mt16"><span class="tiny gold">${yrs > 1 ? `Year ${yrs} together` : 'A tradition begins'}</span>
    <p style="font-size:20px">${yrs > 1 ? `This is your ${ordinal(yrs)} year wrapping ${occTitle(o)} with us. Thank you.` : `We’ll remember ${occTitle(o)}.`}</p>
    <p class="small muted">Next ${dayShort(nx.iso)}${nx.milestone ? `, the ${nx.milestone}` : ''}. Camille will write to you three weeks before.</p></div>`;
}
/** Offered once, right after the booking: the details are already known, so it is a single tap. */
function acctPrompt(b) {
  if (S.user) return `<div class="card row mt16">${ic('check')}<div class="grow small"><b>Saved to your Ribbon Circle account</b><div class="muted">A secure sign-in link was sent to ${esc(S.user.email)}.</div></div></div>`;
  if (b.noAcct) return '';
  return `<div class="card mt16" style="border-color:var(--gold2)"><span class="tiny gold">Ribbon Circle</span>
    <h3 style="font-size:23px;margin:4px 0 6px">${S.occasions.length ? 'Keep your occasions safe' : 'Book faster next time'}</h3>
    <p class="muted small">${S.occasions.length ? 'Create an account so Camille can remember your dates and write to you ahead of each one.' : 'We already have your name, email and address. Keep them, along with this booking, and your next appointment takes seconds.'}</p>
    <button class="btn mt16" data-act="quick-account" data-id="${b.id}">Create my account</button>
    <button class="link mt16" style="display:block;margin:12px auto 0;border:0;color:var(--muted)" data-act="dismiss-acct" data-id="${b.id}">Not now</button>
    <p class="tiny muted center mt8" style="letter-spacing:1px;text-transform:none;font-size:11px">No password to remember. We’ll email a secure sign-in link.</p></div>`;
}
route(/^confirmed\/([\w-]+)$/, id => {
  const b = S.bookings.find(x => x.id === id);
  if (!b) return { redirect: '#/bookings' };
  const p = pkgOf(b.pkg);
  return { html: `<div class="screen">
    <div class="seal"><svg class="ic" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
    <h1 class="title center">Your appointment<br>is reserved.</h1><p class="sub center">A confirmation is on its way to ${esc(b.contact?.email || '')}</p>
    <div class="pad"><div class="appt"><span class="tiny gold">${b.id}</span>
      <div class="when">${dayLong(b.date)}</div>
      <div class="muted">${'Arrival at ' + hourLabel(+b.time)}</div>
      <div class="hline"></div><b style="font-family:var(--serif);font-size:20px;font-weight:500">${p.name}</b>
      <div class="muted small">${b.gifts} gifts · ${esc(b.occasion)} · ${palOf(b.palette).name}</div>
      <div class="muted small mt8">${esc(b.address.line)}${b.address.unit ? ', ' + esc(b.address.unit) : ''}</div></div>
      <p class="muted small mt16 center">Camille will message you the day before. Free changes up to 24 hours ahead.</p>${occConfirm(b)}${acctPrompt(b)}</div>
    <div class="cta"><a class="btn" href="#/track/${b.id}">View booking</a><div class="actions mt8"><button class="btn ghost" data-act="ics" data-id="${b.id}">Add to calendar</button><a class="btn ghost" href="#/">Done</a></div></div></div>` };
});

const bookingCard = b => {
  const p = pkgOf(b.pkg);
  const st = b.status === 'cancelled' ? 'Cancelled' : STAGES.find(s => s.id === b.status).long;
  return `<a class="bk" href="#/track/${b.id}">${gift(b.palette)}<div class="grow"><span class="status ${b.status === 'done' ? 'done' : b.status === 'cancelled' ? 'cancelled' : ''}">${st}</span>
    <div style="font-family:var(--serif);font-size:22px;margin-top:6px">${p.name}</div>
    <div class="muted small">${dayShort(b.date) + ' · ' + hourLabel(+b.time)}</div>
    <div class="muted small">${esc(b.address.line)}</div></div></a>`;
};

route(/^bookings$/, () => {
  const tab = S.bkTab || 'up';
  const list = S.bookings.filter(b => (tab === 'up') === (b.status !== 'done' && b.status !== 'cancelled'))
    .sort((a, b) => tab === 'up' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  return { tab: 'bookings', html: `<div class="screen"><h1 class="title" style="padding-top:calc(24px + var(--safe-t))">Your bookings</h1>
    <div class="seg"><button class="${tab === 'up' ? 'on' : ''}" data-act="bktab" data-v="up">Upcoming</button><button class="${tab === 'past' ? 'on' : ''}" data-act="bktab" data-v="past">Past</button></div>
    ${!S.user && S.bookings.length ? `<div class="pad mb8"><div class="card row"><div class="grow small"><b>Keep these bookings</b><div class="muted">Create an account to see them on any device.</div></div><button class="btn sm ghost" data-act="signup">Create</button></div></div>` : ''}
    <div class="stack">${list.length ? list.map(bookingCard).join('') : `<div class="empty">${gift('noir')}<p class="mt16">${tab === 'up' ? 'Nothing booked yet.' : 'No past bookings.'}</p>
      ${tab === 'up' ? '<button class="btn mt16" data-act="start">Book a wrapper</button>' : ''}${!S.user ? '<button class="link mt16" style="border:0" data-act="signin">Already a client? Sign in</button>' : ''}</div>`}</div></div>${tabbar('bookings')}` };
});

route(/^account$/, () => {
  const u = S.user, rows = u
    ? [['gem', 'Your occasions', S.occasions.length + ' remembered', 'occasions'], ['pin', 'Saved addresses', S.saved.length + ' places', 'addresses'], ['card', 'Payment methods', S.cards.length + ' on file', 'payments'], ['gift', 'Gift cards & offers', 'Send a gift card · WRAP10', 'gifting'], ['chat', 'Concierge & help', 'FAQ, policy, contact us', 'help'], ['sparkle', 'Notifications', 'Reminders and receipts', 'prefs']]
    : [['gift', 'Gift cards & offers', 'Send a gift card · WRAP10', 'gifting'], ['chat', 'Concierge & help', 'FAQ, policy, contact us', 'help']];
  const list = rows.map(([i, t, s, h]) => `<a class="acct" href="#/${h}">${ic(i)}<span class="grow"><b>${t}</b><span class="muted small" style="display:block">${s}</span></span>${ic('chev')}</a>`).join('');
  return { tab: 'account', html: `<div class="screen"><div class="pad" style="padding-top:calc(28px + var(--safe-t))">${u ? `<div class="row"><div class="avatar">${initials(u.name)}</div>
    <div><h2 style="font-size:26px">${esc(u.name)}</h2><div class="muted small">${esc(u.email)}</div></div></div>
    <div class="card mt24 row between"><div><div class="tiny gold">Ribbon Circle</div><b>Member since ${new Date(u.since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</b>
      <div class="muted small">${S.bookings.filter(b => b.status === 'done').length} wraps completed</div></div>${ic('sparkle')}</div>` :
    `<span class="tiny gold">Ribbon Circle</span><h1 style="font-size:34px;line-height:1.1;margin:6px 0 10px">Your details,<br>remembered.</h1>
    <p class="muted">You’re browsing as a guest. You never need an account to book, but one makes every visit faster.</p>
    <ul class="checklist mt16"><li>${ic('check')}Rebook a favourite wrap in one tap</li><li>${ic('check')}Saved addresses and payment cards</li><li>${ic('check')}First access to holiday appointments</li></ul>
    <button class="btn mt24" data-act="signup">Create an account</button><button class="btn ghost mt8" data-act="signin">Sign in</button>`}
    ${installCard(true)}
    <div class="mt24">${list}
    ${u ? `<button class="acct" data-act="signout">${ic('close')}<span class="grow"><b>Sign out</b></span></button>` : ''}
    <button class="acct" data-act="reset">${ic('reset')}<span class="grow"><b>Reset demo data</b><span class="muted small" style="display:block">Clear everything and start as a new guest</span></span></button></div>
    <p class="muted small center mt24">Ribbon &amp; Co. demo · all data is mocked</p></div></div>${tabbar('account')}` };
});

/* ---------- Booking detail ---------- */
function setStatus(id, status) {
  const b = S.bookings.find(x => x.id === id); if (!b) return;
  b.status = status; save();
  if (location.hash === '#/track/' + id) render();
}
function countdown(b) {
  const days = Math.round((fromIso(b.date) - fromIso(iso(new Date()))) / 86400000);
  return days <= 0 ? 'Today at ' + hourLabel(+b.time) : days === 1 ? 'Tomorrow' : `In ${days} days`;
}
/** Written review: prompt after rating, then show it back. */
function reviewBlock(b) {
  return b.review ? `<div class="pad mt16"><div class="card"><div class="tiny muted">Your review</div><p class="mt8" style="font-family:var(--serif);font-size:19px;font-style:italic">“${esc(b.review)}”</p></div></div>`
    : `<div class="pad mt16"><label class="field"><span>Tell us more (optional)</span><textarea id="rv" rows="3" placeholder="What did you love?"></textarea></label>
      <button class="btn ghost sm mt8" style="width:100%" data-act="review-save" data-id="${b.id}">Send review</button></div>`;
}
function bookingView(b) {
  const p = pkgOf(b.pkg), idx = STAGES.findIndex(s => s.id === b.status), cancelled = b.status === 'cancelled';
  const first = WRAPPER.name.split(' ')[0];
  const nextLabel = { confirmed: 'order prepared', assigned: 'day of service', today: 'completed' }[b.status];
  const addons = (b.addons || []).map(id => ADDONS.find(a => a.id === id));
  const intro = {
    confirmed: ['Camille is reserved for you', 'She’ll review your order the day before and arrive with every material.'],
    assigned: [`${first} will be with you`, 'Camille has reviewed your order and prepared every material.'],
    today: [`${first} is on her way`, 'Please have your gifts gathered in one place. You’ll receive a message on arrival.'],
    done: ['Wrapped to perfection', 'We hope they love it.'],
  };
  return `<div class="screen" style="padding-bottom:calc(40px + var(--safe-b))">
    <div class="topbar"><a class="iconbtn" href="#/bookings" aria-label="Back">${ic('back')}</a><div class="grow tiny muted">Booking ${b.id}</div></div>
    <div class="pad"><div class="appt"><span class="status ${b.status === 'done' ? 'done' : cancelled ? 'cancelled' : ''}">${cancelled ? 'Cancelled' : STAGES[idx].long}</span>
      <div class="when">${dayLong(b.date)}</div>
      <div class="muted">${'Arrival at ' + hourLabel(+b.time)}</div>
      ${!cancelled && b.status !== 'done' ? `<div class="tiny gold mt8">${countdown(b)}</div>` : ''}
      <div class="muted small mt8">${esc(b.address.line)}${b.address.unit ? ', ' + esc(b.address.unit) : ''}</div></div></div>
    ${cancelled ? '' : `<div class="pad mt24"><div class="timeline">${STAGES.map((s, i) => `<div class="tl ${i < idx || b.status === 'done' ? 'done' : i === idx ? 'now' : ''}"><i></i>${s.label}</div>`).join('')}</div></div>`}
    <div class="sec"><h3>${cancelled ? 'Booking cancelled' : 'Your wrapper'}</h3></div>
    <div class="pad">${cancelled ? '<p class="muted">No charge was made.</p>' : `<div class="card"><div class="row"><div class="avatar">CL</div><div class="grow"><b style="font-family:var(--serif);font-size:20px;font-weight:500">${WRAPPER.name}</b>
        <div class="muted small">★ ${WRAPPER.rating} · ${WRAPPER.wraps.toLocaleString()} wraps · ${WRAPPER.bio}</div></div></div>
        <p class="small mt16">${intro[b.status][1]}</p>
        <div class="actions mt16"><button class="btn ghost sm" data-act="chat">Message</button><button class="btn ghost sm" data-act="call">Call</button></div></div>`}</div>
    ${b.status === 'done' ? `<div class="sec"><h3>Rate your experience</h3></div><div class="stars">${[1, 2, 3, 4, 5].map(n => `<button class="${(b.rating || 0) >= n ? 'on' : ''}" data-act="rate" data-id="${b.id}" data-v="${n}" aria-label="${n} stars"><svg viewBox="0 0 24 24">${ICONS.star}</svg></button>`).join('')}</div>` : ''}
    ${b.status === 'done' && b.rating ? reviewBlock(b) : ''}
    <div class="sec"><h3>Your order</h3></div>
    <div class="pad"><div class="card"><div class="row">${gift(b.palette, 56)}<div class="grow"><b style="font-family:var(--serif);font-size:20px;font-weight:500">${p.name}</b>
      <div class="muted small">${b.gifts} gifts · ${esc(b.occasion)} · ${palOf(b.palette).name}</div></div></div>
      ${addons.length ? `<div class="hline"></div><div class="small">${addons.map(a => `<div class="row between"><span>${a.name}</span><span class="muted">${money(a.price)}</span></div>`).join('')}</div>` : ''}
      ${(b.items || []).length ? `<div class="hline"></div><div class="tiny muted">Your gifts</div><div class="small mt8">${b.items.map(i => `<div class="row between"><span>${esc(i.what || 'Gift')}</span><span class="muted">${i.who ? 'for ' + esc(i.who) : ''}</span></div>`).join('')}</div>` : ''}
      ${(b.photos || []).length ? `<div class="photos mt8">${b.photos.map((p, i) => `<div class="ph"><img src="${p}" alt="Gift photo ${i + 1}"></div>`).join('')}</div>` : ''}
      ${b.cardmsg ? `<div class="hline"></div><div class="tiny muted">Card message</div><p class="small mt8" style="font-family:var(--serif);font-size:18px;font-style:italic">“${esc(b.cardmsg)}”</p>` : ''}
      ${b.note ? `<div class="hline"></div><div class="tiny muted">Your note</div><p class="small mt8">${esc(b.note)}</p>` : ''}
      <div class="hline"></div><div class="row between"><span>Total</span><b style="font-family:var(--serif);font-size:22px;font-weight:500">${money(b.total)}</b></div></div></div>
    ${cancelled || b.status === 'done' ? '' : `<div class="sec"><h3>Before we arrive</h3></div><div class="pad"><ul class="checklist">
      <li>${ic('check')}Gather your gifts in one room, with any boxes or bags to be reused.</li>
      <li>${ic('check')}Set aside a clear table or surface about 1.5 m wide.</li>
      <li>${ic('check')}Have recipient names ready if you’ve ordered gift tags.</li>
      <li>${ic('check')}We bring all paper, ribbon and tools, and take away every offcut.</li></ul></div>`}
    <div class="pad mt24"><div class="actions" style="margin-bottom:10px"><a class="btn ghost" href="#/receipt/${b.id}">Receipt</a><button class="btn ghost" data-act="share" data-id="${b.id}">Share</button></div>
      <div class="actions"><button class="btn ghost" data-act="ics" data-id="${b.id}">Calendar</button>
      ${b.status === 'done' || cancelled ? `<button class="btn" data-act="rebook" data-id="${b.id}">Book again</button>` : `<button class="btn ghost" data-act="resched" data-id="${b.id}">Reschedule</button>`}</div>
      ${b.status === 'done' || cancelled ? '' : `<button class="btn danger mt8" data-act="cancel" data-id="${b.id}">Cancel booking</button>`}
      ${b.moved ? `<p class="muted small center mt16">Rescheduled ${b.moved} time${b.moved > 1 ? 's' : ''} · free of charge</p>` : ''}
      ${nextLabel && !cancelled ? `<button class="previewlink" data-act="advance" data-id="${b.id}">Demo: preview “${nextLabel}” ›</button>` : ''}</div></div>`;
}

route(/^receipt\/([\w-]+)$/, id => {
  const b = S.bookings.find(x => x.id === id);
  if (!b) return { redirect: '#/bookings' };
  const p = pkgOf(b.pkg), q = b.q, c = b.contact || {};
  const lines = q ? [[p.name, p.price], q.extra && [`${b.gifts - p.incl} extra gifts`, q.extra], ...(b.addons || []).map(id => { const a = ADDONS.find(x => x.id === id); return [a.name, a.price]; }),
      q.asap && ['Same-day priority', q.asap], q.perk && ['Complimentary wax seal', -q.perk], q.discount && [`Promo ${q.promo.toUpperCase()}`, -q.discount], ['Service fee', q.fee], ['Tax', q.tax], q.tip && ['Gratuity', q.tip]].filter(Boolean)
    : [[p.name, p.price], ['Service, tax & gratuity', b.total - p.price]];
  return { html: `<div class="screen" style="padding-bottom:40px"><div class="topbar noprint"><a class="iconbtn" href="#/track/${b.id}" aria-label="Back">${ic('back')}</a><div class="grow tiny muted">Receipt</div></div>
    <div class="pad"><div class="receipt"><div class="center"><div class="brand">Ribbon &amp; Co.<small>GIFT WRAPPING ATELIER</small></div></div><div class="hline"></div>
      <div class="row between small"><span class="muted">Receipt</span><b>${b.id}</b></div>
      <div class="row between small"><span class="muted">Date of service</span><span>${dayLong(b.date)}, ${hourLabel(+b.time)}</span></div>
      <div class="row between small"><span class="muted">Billed to</span><span>${esc(c.name || '')}</span></div>
      <div class="row between small"><span class="muted">Location</span><span style="text-align:right;max-width:60%">${esc(b.address.line)}</span></div>
      <div class="row between small"><span class="muted">Paid with</span><span>${esc(([WALLET, ...PAYMENTS, ...S.cards].find(x => x.id === b.pay) || WALLET).name)}</span></div>
      <div class="hline"></div><div class="sum">${lines.map(([n, v]) => `<div class="line ${v < 0 ? 'disc' : ''}"><span>${n}</span><span>${v < 0 ? '−' : ''}${money(Math.abs(v))}</span></div>`).join('')}
      <div class="line tot"><span>Total</span><span>${money(b.total)}</span></div></div>
      <p class="muted small center mt24">${b.status === 'done' ? 'Paid in full. Thank you.' : b.status === 'cancelled' ? 'This booking was cancelled; no charge was made.' : 'Your card is charged once the service is completed.'}</p></div>
      <button class="btn mt24 noprint" data-act="print">Print or save as PDF</button></div></div>` };
});

route(/^track\/([\w-]+)$/, id => {
  const b = S.bookings.find(x => x.id === id);
  if (!b) return { redirect: '#/bookings' };
  return { html: bookingView(b) };
});


/* ---------- Occasions: remembered annual dates ---------- */
const ANNUAL = ['Birthday', 'Anniversary', 'Wedding'];
const GEMS = { 1: 'Paper', 2: 'Cotton', 5: 'Wood', 10: 'Tin', 15: 'Crystal', 20: 'China', 25: 'Silver', 30: 'Pearl', 35: 'Coral', 40: 'Ruby', 45: 'Sapphire', 50: 'Golden', 55: 'Emerald', 60: 'Diamond' };
const ordinal = n => { const t = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (t[(v - 20) % 10] || t[v] || t[0]); };
const occTitle = o => o.kind === 'Birthday' ? `${esc(o.who)}’s birthday` : `${o.who ? esc(o.who) + ' · ' : ''}anniversary`;
/** Next occurrence of an annual date, with milestone detail when the original year is known. */
function nextOcc(o) {
  const [y, m, d] = o.date.split('-').map(Number), today = fromIso(iso(new Date()));
  const at = Y => { const dt = new Date(Y, m - 1, d); return dt.getMonth() === m - 1 ? dt : new Date(Y, m - 1, 28); };
  let yr = today.getFullYear(), dt = at(yr); if (dt < today) dt = at(++yr);
  const n = y && y < yr ? yr - y : null; let line = null, milestone = null;
  if (n) {
    if (o.kind === 'Birthday') { line = `Turning ${n}`; if (n % 10 === 0 || n === 18 || n === 21) milestone = `${ordinal(n)} birthday`; }
    else { line = `${ordinal(n)} anniversary`; if (GEMS[n]) milestone = `${GEMS[n]} anniversary`; }
  }
  return { iso: iso(dt), days: Math.round((dt - today) / 86400000), n, line, milestone };
}
const lastWrap = o => (o.history || [])[(o.history || []).length - 1];
const occMins = o => { const l = lastWrap(o); return l ? pkgOf(l.pkg).mins : 75; };
/** How many days before the occasion Camille still has an opening. */
function openingsBefore(o) {
  const nx = nextOcc(o), mins = occMins(o); let n = 0, first = null;
  for (let i = 0; i < Math.min(Math.max(nx.days, 1), 60); i++) { const k = iso(plusDays(i)); if (openCount(k, mins)) { n++; first ||= k; } }
  return { n, first };
}
const availLine = o => { const a = openingsBefore(o); return a.n ? `Camille has ${a.n} day${a.n > 1 ? 's' : ''} with openings before the occasion, the first on ${dayShort(a.first)}.` : 'Camille is fully booked before the day. Reserve soon or join the waiting list.'; };
const lastLine = o => { const l = lastWrap(o); if (!l) return ''; const a = (l.addons || []).filter(id => id !== 'card' && ADDONS.find(x => x.id === id)).map(id => ADDONS.find(x => x.id === id).name.toLowerCase());
  return `${pkgOf(l.pkg).name} in ${palOf(l.palette).name}${a.length ? ', with ' + a.join(' and ') : ''}`; };
/** A personal note from Camille, shown when a remembered date is approaching. */
function occLetter(o) {
  const nx = nextOcc(o), first = firstName(), l = lastWrap(o);
  const when = nx.days === 0 ? 'is today' : nx.days === 1 ? 'is tomorrow' : `is ${nx.days} days away`;
  return `<div class="pad mt24"><div class="letter"><span class="tiny gold">A note from Camille</span>
    <p class="hello">${first ? 'Dear ' + esc(first) + ',' : 'Hello,'}</p>
    <p>${occTitle(o).replace(/^./, c => c.toUpperCase())} ${when}, on ${dayLong(nx.iso)}.${nx.milestone ? ` A milestone worth marking: the <b>${nx.milestone}</b>.` : ''}</p>
    ${l ? `<p>I remember your last visit: ${lastLine(o)}. I’d be honoured to wrap it again, perhaps with something new.</p>` : ''}
    <p class="small muted">${availLine(o)}</p>
    <button class="btn mt16" data-act="occ-book" data-id="${o.id}">Reserve Camille</button>
    <button class="link" style="display:block;margin:14px auto 0;border:0;color:var(--muted)" data-act="occ-snooze" data-id="${o.id}">Remind me later</button></div></div>`;
}
function occCard(o) {
  const nx = nextOcc(o), dt = fromIso(nx.iso), l = lastWrap(o);
  return `<div class="occ ${nx.milestone ? 'mile' : ''}"><div class="row" style="align-items:flex-start">
    <div class="occdate"><b>${dt.getDate()}</b><small>${dt.toLocaleDateString('en-US', { month: 'short' })}</small></div>
    <div class="grow"><div class="tiny gold">${nx.milestone ? '✦ ' + nx.milestone : o.kind}</div>
      <div style="font-family:var(--serif);font-size:23px;line-height:1.15">${occTitle(o).replace(/^./, c => c.toUpperCase())}</div>
      <div class="muted small">${nx.days === 0 ? 'Today' : nx.days === 1 ? 'Tomorrow' : 'In ' + nx.days + ' days'}${nx.line ? ' · ' + nx.line : ''}</div>
      ${l ? `<div class="muted small mt8">Last wrapped ${dayShort(l.date)}: ${lastLine(o)}</div>` : ''}</div></div>
    <div class="actions mt16"><button class="btn sm" data-act="occ-book" data-id="${o.id}">Reserve</button><button class="btn sm ghost" data-act="occ-edit" data-id="${o.id}">Edit</button></div></div>`;
}
route(/^occasions$/, () => {
  const list = S.occasions.map(o => [o, nextOcc(o)]).sort((a, b) => a[1].days - b[1].days);
  return { tab: 'occasions', html: `<div class="screen"><span class="tiny eyebrow" style="padding-top:calc(30px + var(--safe-t))">Remembered</span>
    <h1 class="title" style="padding-top:6px">Your occasions</h1>
    <p class="sub">The dates that matter, kept for you. Three weeks ahead, Camille will write so your appointment is secured in good time.</p>
    ${list.length ? `<div class="stack">${list.map(([o]) => occCard(o)).join('')}</div>` : `<div class="empty" style="padding-top:20px">${gift('ivory')}<p class="mt16">No occasions yet.<br>Tell us a date that matters and we’ll remember it every year.</p></div>`}
    <div class="pad mt16"><button class="btn ghost" data-act="occ-add">${ic('plus')} Remember a new occasion</button></div>
    <div class="sec"><h3>The season of giving</h3></div>
    <div class="stack"><button class="season" data-act="start" data-pkg="signature" data-occ="Holiday"><span class="tiny">Every December</span><b>Holiday wrapping</b><span class="small">Camille’s December diary opens first to those who’ve booked before.</span></button></div>
    <div class="sec"><h3>How we remember</h3></div>
    <div class="how"><div><i>I</i><span><b>You tell us once</b><span class="muted small">Add a date when you book, or here, at any time.</span></span></div>
      <div><i>II</i><span><b>We write ahead</b><span class="muted small">A personal note arrives three weeks before, with Camille’s availability.</span></span></div>
      <div><i>III</i><span><b>Your wrap, remembered</b><span class="muted small">We keep your palette and finishing touches, and reward each returning year.</span></span></div></div>
  </div>${tabbar('occasions')}` };
});

/** Customize step: invite a first-time tradition, or celebrate a returning one. */
function traditionBlock(d) {
  if (d.occId) {
    const o = S.occasions.find(x => x.id === d.occId); if (!o) return '';
    const l = lastWrap(o), tried = (l?.addons || []), idea = ADDONS.find(a => a.id !== 'card' && !tried.includes(a.id) && !d.addons.includes(a.id));
    return `<div class="pad mt16"><div class="letter" style="text-align:left"><span class="tiny gold">Your tradition · ${occTitle(o)}</span>
      <p style="font-size:19px">${l ? `Last time: ${lastLine(o)}. We’ve kept your choices.` : 'We’ll remember this occasion each year.'}</p>
      ${d.perk ? `<p class="small" style="color:var(--ok)">${ic('check')} A complimentary monogram wax seal is included, with our thanks.</p>` : ''}
      ${idea ? `<p class="small muted">Something new this year? <a class="link" data-act="addon" data-id="${idea.id}">${idea.name} · +${money(idea.price)}</a></p>` : ''}</div></div>`;
  }
  if (!ANNUAL.includes(d.occasion)) return '';
  return `<div class="pad mt16"><div class="card" style="${d.remember ? 'border-color:var(--ink)' : ''}"><button class="row" style="width:100%;text-align:left" data-act="remember-toggle"><span class="check ${d.remember ? 'on' : ''}">${ic('check')}</span>
    <span class="grow"><b style="font-family:var(--serif);font-size:19px;font-weight:500">Make it a tradition</b><span class="muted small" style="display:block">We’ll remember this ${d.occasion.toLowerCase()} and write to you three weeks ahead each year.</span></span></button>
    ${d.remember ? `<div style="display:grid;gap:10px;margin-top:14px"><label class="field"><span>${d.occasion === 'Birthday' ? 'Whose birthday?' : 'Whose anniversary?'}</span><input data-bind="remWho" value="${esc(d.remWho)}" placeholder="${d.occasion === 'Birthday' ? 'Mum' : 'Sarah & James'}"></label>
      <label class="field"><span>Date (add the original year for milestones)</span><input type="date" data-bind="remDate" value="${esc(d.remDate)}"></label></div>` : ''}</div></div>`;
}
function occSheet(id) {
  const o = id ? S.occasions.find(x => x.id === id) : null; pendKind = o ? o.kind : 'Birthday';
  openSheet(`<h3>${o ? 'Edit occasion' : 'Remember an occasion'}</h3>
    <div class="chips" style="padding:0">${ANNUAL.map(k => `<button class="chip ${k === pendKind ? 'on' : ''}" data-act="occ-kind" data-v="${k}">${k}</button>`).join('')}</div>
    <div style="display:grid;gap:10px" class="mt16"><label class="field"><span id="oc-lbl">${pendKind === 'Birthday' ? 'Whose birthday?' : 'Who is celebrating?'}</span><input id="oc-who" value="${esc(o?.who || '')}" placeholder="Mum"></label>
      <label class="field"><span>Date (add the original year for milestones)</span><input id="oc-date" type="date" value="${esc(o?.date || '')}"></label>
      <button class="btn" data-act="occ-save" data-id="${id || ''}">Remember this date</button>
      ${o ? `<button class="btn danger" data-act="occ-del" data-id="${id}">Remove</button>` : ''}</div>`);
}
let pendKind = 'Birthday';

/* ---------- Account sub-pages ---------- */
const sub = (title, intro, body, back = '#/account') => ({ html: `<div class="screen"><div class="topbar"><a class="iconbtn" href="${back}" aria-label="Back">${ic('back')}</a><div class="grow tiny muted">Account</div></div>
  <h1 class="title">${title}</h1><p class="sub">${intro}</p>${body}</div>` });

route(/^addresses$/, () => sub('Saved addresses', 'Where should we come? Save your usual places for faster booking.',
  `<div class="pad">${S.saved.map((a, i) => `<div class="sugg"><span class="pin">${ic(a.label === 'Home' ? 'home' : 'pin')}</span><span class="grow"><b>${esc(a.label)}</b>
    <span class="muted small" style="display:block">${esc(a.line)}${a.unit ? ', ' + esc(a.unit) : ''}</span></span><button class="link" data-act="addr-del" data-i="${i}">Remove</button></div>`).join('') || '<p class="muted">No saved addresses.</p>'}</div>
  <div class="pad mt24"><button class="btn ghost" data-act="addr-add">Add an address</button></div>`));

route(/^payments$/, () => sub('Payment methods', 'Your card is only charged once your wrapper has completed the job.',
  `<div class="stack">${S.cards.map(c => `<div class="pay"><span class="cardlogo">${c.logo}</span><span class="grow">${esc(c.name)}</span><button class="link" data-act="card-del" data-id="${c.id}">Remove</button></div>`).join('') || '<p class="muted">No payment methods yet.</p>'}</div>
  <div class="pad mt24"><button class="btn ghost" data-act="card-add">Add a card</button></div>`));

route(/^gifting$/, () => sub('Gift cards &amp; offers', 'Give the gift of beautiful wrapping, or use an offer on your next booking.',
  `<div class="sec" style="padding-top:6px"><h3>Offers</h3></div><div class="stack">${Object.entries(PROMOS).map(([c, r]) => `<div class="card row"><div class="grow"><b style="font-family:var(--serif);font-size:20px;font-weight:500">${r * 100}% off</b>
    <div class="muted small">Code <b>${c}</b> · ${c === 'WELCOME15' ? 'New clients' : 'Any package'}</div></div><button class="btn sm ghost" data-act="use-promo" data-v="${c}">Use</button></div>`).join('')}</div>
  <div class="sec"><h3>Send a gift card</h3></div>
  <div class="chips" id="amts">${[100, 250, 500, 1000].map(a => `<button class="chip ${a === 250 ? 'on' : ''}" data-act="gc-amt" data-v="${a}">${money(a)}</button>`).join('')}</div>
  <div class="stack mt16"><label class="field"><span>Recipient name</span><input id="gc-to" placeholder="Eleanor"></label>
    <label class="field"><span>Message</span><textarea id="gc-msg" rows="2" placeholder="For your next beautiful occasion"></textarea></label>
    <button class="btn" data-act="gc-buy">Purchase gift card</button></div>
  ${S.giftcards.length ? `<div class="sec"><h3>Sent</h3></div><div class="stack">${S.giftcards.map(g => `<div class="card row between"><div><b>${money(g.amount)} · ${esc(g.to)}</b><div class="muted small">${g.code}</div></div><span class="status done">Delivered</span></div>`).join('')}</div>` : ''}`));

route(/^help$/, () => sub('Concierge &amp; help', 'Our team is available daily from 8am to 8pm.',
  `<div class="pad"><div class="actions"><button class="btn ghost" data-act="chat-support">Message us</button><button class="btn ghost" data-act="call-support">Call us</button></div></div>
  <div class="sec"><h3>Common questions</h3></div><div class="pad faq">${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  <div class="sec"><h3>Our policy</h3></div><div class="pad"><p class="muted small">Cancel or reschedule free of charge up to 24 hours before your appointment. Within 24 hours a 50% fee applies. If we’re unable to deliver the service, you are never charged.</p></div>`));

route(/^prefs$/, () => sub('Notifications', 'Choose how we keep you informed.',
  `<div class="pad">${[['occ', 'Occasion reminders', 'A personal note three weeks before each remembered date'], ['sms', 'Text reminders', 'The day before, and when your wrapper is on the way'], ['email', 'Email receipts', 'Confirmations and receipts'], ['holiday', 'Seasonal invitations', 'Early access to holiday dates']].map(([k, t, d]) =>
    `<button class="acct" data-act="pref" data-k="${k}"><span class="grow"><b>${t}</b><span class="muted small" style="display:block">${d}</span></span><span class="toggle ${S.prefs[k] ? 'on' : ''}"><i></i></span></button>`).join('')}</div>`));

/* ---------- Router ---------- */
let current = '';
function render() {
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
    if (r.mount) r.mount();
    return;
  }
  location.replace('#/');
}
window.addEventListener('hashchange', () => { closeSheet(); render(); });

/* ---------- Actions ---------- */
const bind = (path, v) => { const parts = path.split('.'); let o = parts[0] === 'contact' ? S : draft(); while (parts.length > 1) o = o[parts.shift()] ||= {}; o[parts[0]] = v; save(); };
let pend = {};
function authSheet(mode) {
  const up = mode === 'signup';
  openSheet(`<div id="auth" data-mode="${mode}"><h3>${up ? 'Create your account' : 'Welcome back'}</h3>
    <p class="muted small mb8">${up ? 'No password to remember. We’ll email a secure sign-in link.' : 'We’ll send a one-time code to your email.'}</p>
    <div id="auth-1"><div class="actions mt16"><button class="btn ghost sm" data-act="social" data-v="Apple">Apple</button><button class="btn ghost sm" data-act="social" data-v="Google">Google</button></div>
      <p class="tiny muted center" style="margin:14px 0">or with email</p>
      <div style="display:grid;gap:10px">${up ? `<label class="field"><span>Full name</span><input id="an" autocomplete="name" value="${esc(S.contact.name)}"></label>` : ''}
      <label class="field"><span>Email</span><input id="ae" type="email" inputmode="email" autocomplete="email" value="${esc(S.contact.email)}" placeholder="you@example.com"></label>
      ${up ? `<label class="field"><span>Mobile (optional)</span><input id="ap" type="tel" inputmode="tel" autocomplete="tel" value="${esc(S.contact.phone)}"></label>` : ''}
      <button class="btn" data-act="auth-submit">${up ? 'Create account' : 'Send me a code'}</button></div>
      <p class="small center mt16 muted">${up ? 'Already have an account?' : 'New here?'} <a class="link" data-act="auth-switch" data-v="${up ? 'signin' : 'signup'}">${up ? 'Sign in' : 'Create an account'}</a></p>
      ${up ? '' : `<p class="small center mt8"><a class="link" data-act="auth-demo">Use the demo account</a></p>`}</div>
    <div id="auth-2" hidden><p class="mt16">Enter the 6-digit code we sent to <b id="aem"></b>.</p>
      <label class="field mt16"><span>Code</span><input id="acode" inputmode="numeric" maxlength="6" placeholder="123456" autocomplete="one-time-code"></label>
      <button class="btn mt16" data-act="auth-code">Sign in</button><p class="muted small center mt8">Demo: any 6 digits will work.</p></div></div>`);
}
const actions = {
  start(el) { if (!S.draft || S.draft.resched || el.dataset.pkg) S.draft = newDraft(el.dataset.pkg); if (el.dataset.occ) S.draft.occasion = el.dataset.occ; save(); location.hash = el.dataset.pkg ? '#/customize' : '#/packages'; },
  exit() { S.draft = null; save(); },
  'pick-pkg'(el) { const p = pkgOf(el.dataset.id), d = draft(); d.pkg = p.id; d.gifts = p.incl; if (!timeStillFree(d)) d.time = null; save(); render(); },
  gifts(el) { const d = draft(); d.gifts = Math.min(30, Math.max(1, d.gifts + +el.dataset.d)); if (!timeStillFree(d)) d.time = null; save(); render(); },
  occasion(el) { draft().occasion = el.dataset.v; save(); render(); },
  palette(el) { draft().palette = el.dataset.id; save(); render(); },
  addon(el) { const d = draft(), i = d.addons.indexOf(el.dataset.id); i < 0 ? d.addons.push(el.dataset.id) : d.addons.splice(i, 1); save(); render(); },
  day(el) { const d = draft(); d.date = el.dataset.v; if (!timeStillFree(d)) d.time = null; save(); render(); const a = $('.day.on'); a && a.scrollIntoView({ inline: 'center', block: 'nearest' }); },
  waitlist(el) { S.waitlist ||= {}; S.waitlist[el.dataset.v] = !S.waitlist[el.dataset.v]; save(); render(); toast(S.waitlist[el.dataset.v] ? 'We’ll message you if a time opens' : 'Removed from waiting list'); },
  slot(el) { draft().time = el.dataset.v; save(); render(); },
  asap() { const d = draft(), e = earliestToday(durMins(d), d.resched); if (!e) return; d.date = iso(new Date()); d.time = String(e.h); save(); render(); },
  saved(el) { draft().address = { ...S.saved[+el.dataset.i] }; save(); render(); },
  place(el) { draft().address = { label: 'New address', line: el.dataset.v, unit: '' }; save(); render(); },
  locate() { draft().address = { label: 'Current location', line: '350 5th Ave, New York, NY 10118', unit: '' }; save(); toast('Location found'); render(); },
  tip(el) { draft().tip = +el.dataset.v; save(); render(); },
  pay(el) { draft().pay = el.dataset.id; save(); render(); },
  promo() { draft().promo = $('#promo').value.trim(); save(); render(); },
  book() {
    if (!contactOk()) return;
    const d = draft(), q = quote(d);
    const b = { id: 'GW-' + String(Math.floor(10000 + Math.random() * 89999)), pkg: d.pkg, gifts: d.gifts, palette: d.palette, occasion: d.occasion, addons: d.addons.slice(),
      contact: { ...S.contact }, q: (({ extra, addons, asap, discount, perk, fee, tax, tip, total }) => ({ extra, addons, asap, discount, perk, fee, tax, tip, total, promo: d.promo }))(q), items: d.items.filter(i => i.who || i.what), photos: d.photos.slice(), note: d.note, cardmsg: d.addons.includes('card') ? d.cardmsg : '', date: d.date, time: d.time, mins: durMins(d), address: { ...d.address }, total: q.total, status: 'confirmed', createdAt: Date.now(), pay: d.pay };
    const snap = { date: b.date, pkg: b.pkg, gifts: b.gifts, palette: b.palette, addons: b.addons, items: b.items, address: b.address, total: b.total };
    let o = d.occId && S.occasions.find(x => x.id === d.occId);
    if (o) (o.history ||= []).push(snap);
    else if (d.remember && d.remDate && (d.remWho.trim() || d.occasion !== 'Birthday')) { o = { id: 'o' + Date.now(), kind: d.occasion, who: d.remWho.trim(), date: d.remDate, history: [snap] }; S.occasions.push(o); }
    if (o) b.occId = o.id;
    S.bookings.unshift(b); S.draft = null; S.bkTab = 'up'; if (S.user) { S.user.phone ||= S.contact.phone; } save();
    location.hash = '#/confirmed/' + b.id;
  },
  bktab(el) { S.bkTab = el.dataset.v; save(); render(); },
  advance(el) {
    const b = S.bookings.find(x => x.id === el.dataset.id), i = STAGES.findIndex(s => s.id === b.status);
    setStatus(b.id, STAGES[Math.min(i + 1, STAGES.length - 1)].id);
    const msg = { assigned: 'Camille has been assigned', today: 'Camille is on her way', done: 'All wrapped!' }[b.status];
    msg && toast(msg);
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
    Object.assign(d, { gifts: b.gifts, palette: b.palette, occasion: b.occasion, addons: (b.addons || []).slice(), cardmsg: b.cardmsg || '', items: (b.items || []).map(i => ({ ...i })), address: { ...b.address } });
    S.draft = d; save(); location.hash = '#/schedule';
  },
  ics(el) {
    const b = S.bookings.find(x => x.id === el.dataset.id), p = pkgOf(b.pkg);
    const d = fromIso(b.date); d.setHours(+b.time, 0, 0, 0);
    const f = x => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const end = new Date(d.getTime() + (b.mins || p.mins) * 60000);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ribbon & Co.//Demo//EN', 'BEGIN:VEVENT', `UID:${b.id}@ribbon.demo`, `DTSTAMP:${f(new Date())}`,
      `DTSTART:${f(d)}`, `DTEND:${f(end)}`, `SUMMARY:Ribbon & Co. — ${p.name}`, `LOCATION:${b.address.line.replace(/,/g, '\\,')}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = b.id + '.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('Calendar event downloaded');
  },
  'pkg-info'(el) {
    const p = pkgOf(el.dataset.id), i = PACKAGES.indexOf(p);
    openSheet(`<div class="center">${gift(PALETTES[[1, 0, 3, 2][i]].id, 90)}<span class="tiny gold" style="display:block">${p.badge}</span><h3>${p.name}</h3>
      <p class="muted small">${p.tag}</p></div><div class="hline"></div>
      <div class="row between"><span>From</span><b style="font-family:var(--serif);font-size:22px;font-weight:500">${money(p.price)}</b></div>
      <div class="row between small muted"><span>${p.incl} gifts included</span><span>then ${money(p.extra)} each</span></div>
      <div class="row between small muted"><span>Approx. time</span><span>${p.mins >= 120 ? p.mins / 60 + ' hours' : p.mins + ' minutes'}${p.wrappers > 1 ? ' · two wrappers' : ''}</span></div>
      <div class="hline"></div><ul class="feat" style="border:0;margin:0;padding:0">${p.feats.map(f => `<li>${ic('check')}${f}</li>`).join('')}</ul>
      <div class="sec" style="padding:22px 0 6px"><h3 style="font-size:20px">The ritual</h3></div>
      <div class="how" style="padding:0">${RITUAL.map(([t, d], n) => `<div style="padding:12px 0"><i style="font-size:22px">${n + 1}</i><span><b style="font-size:17px">${t}</b><span class="muted small">${d}</span></span></div>`).join('')}</div>
      <button class="btn mt16" data-act="pick-close" data-id="${p.id}">Select ${p.name}</button>`);
  },
  'pick-close'(el) { const p = pkgOf(el.dataset.id), d = draft(); d.pkg = p.id; d.gifts = p.incl; if (!timeStillFree(d)) d.time = null; save(); closeSheet(); render(); },
  resched(el) {
    const b = S.bookings.find(x => x.id === el.dataset.id), d = newDraft(b.pkg);
    Object.assign(d, { gifts: b.gifts, address: { ...b.address }, resched: b.id }); d.date = firstOpenDate(b.mins || pkgOf(b.pkg).mins, b.id); d.time = null;
    S.draft = d; save(); location.hash = '#/schedule';
  },
  'resched-save'() {
    const d = draft(), b = S.bookings.find(x => x.id === d.resched);
    b.date = d.date; b.time = d.time; b.mins = durMins(d); b.moved = (b.moved || 0) + 1; b.status = 'confirmed'; S.draft = null; save();
    location.hash = '#/track/' + b.id; toast('Appointment moved to ' + dayShort(b.date));
  },
  'addr-del'(el) { S.saved.splice(+el.dataset.i, 1); save(); render(); },
  'addr-add'() {
    pend = { label: 'Home', line: '' };
    openSheet(`<h3>Add an address</h3><div class="searchbox" style="margin:0">${ic('search')}<input id="aq" placeholder="Search address" autocomplete="off"></div><div id="ares"></div>
      <div class="chips mt16" style="padding:0">${['Home', 'Office', 'Family', 'Other'].map(l => `<button class="chip ${l === 'Home' ? 'on' : ''}" data-act="addr-label" data-v="${l}">${l}</button>`).join('')}</div>
      <label class="field mt16"><span>Apt / suite / floor</span><input id="au" placeholder="Optional"></label>
      <button class="btn mt16" data-act="addr-save" disabled id="asave">Save address</button>`, () => {
      $('#aq').addEventListener('input', e => {
        const v = e.target.value.trim().toLowerCase(); pend.line = ''; $('#asave').disabled = true;
        const hits = v.length < 2 ? [] : PLACES.filter(p => p.toLowerCase().includes(v)).slice(0, 4);
        $('#ares').innerHTML = hits.map(h => `<button class="sugg" data-act="addr-pick" data-v="${esc(h)}"><span class="pin">${ic('pin')}</span><span class="grow">${esc(h)}</span></button>`).join('');
      });
    });
  },
  'addr-pick'(el) { pend.line = el.dataset.v; $('#aq').value = pend.line; $('#ares').innerHTML = ''; $('#asave').disabled = false; },
  'addr-label'(el) { pend.label = el.dataset.v; document.querySelectorAll('[data-act=addr-label]').forEach(c => c.classList.toggle('on', c === el)); },
  'addr-save'() { if (!pend.line) return; S.saved.push({ label: pend.label, line: pend.line, unit: $('#au').value.trim() }); save(); closeSheet(); render(); toast('Address saved'); },
  'card-del'(el) { S.cards = S.cards.filter(c => c.id !== el.dataset.id); save(); render(); },
  'card-add'() {
    openSheet(`<h3>Add a card</h3><div class="stack" style="padding:0"><label class="field"><span>Card number</span><input id="cn" inputmode="numeric" placeholder="4242 4242 4242 4242" maxlength="19" autocomplete="off"></label>
      <div class="row"><label class="field grow"><span>Expiry</span><input id="ce" inputmode="numeric" placeholder="MM/YY" maxlength="5"></label><label class="field grow"><span>CVC</span><input id="cc" inputmode="numeric" placeholder="123" maxlength="4"></label></div>
      <button class="btn" data-act="card-save">Save card</button><p class="muted small center">Demo only — no real card is stored or charged.</p></div>`, () => {
      $('#cn').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); });
      $('#ce').addEventListener('input', e => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); e.target.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v; });
    });
  },
  'card-save'() {
    const n = $('#cn').value.replace(/\D/g, '');
    if (n.length < 13) { toast('Enter a valid card number'); return; }
    const brand = { 4: ['Visa', 'VISA'], 5: ['Mastercard', 'MC'], 3: ['Amex', 'AMEX'] }[n[0]] || ['Card', 'CARD'];
    S.cards.push({ id: 'c' + Date.now(), name: `${brand[0]} •••• ${n.slice(-4)}`, logo: brand[1] });
    save(); closeSheet(); render(); toast('Card added');
  },
  'use-promo'(el) { draft().promo = el.dataset.v; save(); toast(el.dataset.v + ' will apply at checkout'); },
  'gc-amt'(el) { document.querySelectorAll('[data-act=gc-amt]').forEach(c => c.classList.toggle('on', c === el)); },
  'gc-buy'() {
    const amt = +document.querySelector('[data-act=gc-amt].on').dataset.v, to = $('#gc-to').value.trim();
    if (!to) { toast('Add the recipient’s name'); return; }
    S.giftcards.unshift({ id: Date.now(), amount: amt, to, msg: $('#gc-msg').value, code: 'RC-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase() });
    save(); render(); toast('Gift card sent to ' + to);
  },
  pref(el) { S.prefs[el.dataset.k] = !S.prefs[el.dataset.k]; save(); render(); },
  'call-support'() { toast('Calling concierge… (demo)'); },
  'chat-support'() {
    openSheet(`<h3>Concierge</h3><div id="msgs" style="display:grid;gap:8px;margin-bottom:14px"><div class="bubble them">Good day${firstName() ? ', ' + esc(firstName()) : ''}. How may we assist?</div></div>
      <div class="chips" style="padding:0 0 12px">${['Change my appointment', 'Question about a package', 'Corporate gifting', 'Something else'].map(t => `<button class="chip" data-act="reply" data-v="${t}">${t}</button>`).join('')}</div>`);
  },
  signin() { authSheet('signin'); },
  signup() { authSheet('signup'); },
  social(el) { signIn(DEMO_EMAIL); closeSheet(); render(); toast('Signed in with ' + el.dataset.v); },
  'auth-submit'() {
    const mode = $('#auth').dataset.mode;
    if (mode === 'signup') {
      const name = $('#an').value, email = $('#ae').value, phone = $('#ap').value;
      if (name.trim().length < 2) return toast('Please add your name');
      if (!validEmail(email)) return toast('Please enter a valid email');
      createAccount({ name, email, phone }); closeSheet(); render(); toast('Welcome to Ribbon Circle');
    } else {
      const email = $('#ae').value;
      if (!validEmail(email)) return toast('Please enter a valid email');
      $('#auth-1').hidden = true; $('#auth-2').hidden = false; $('#aem').textContent = email.trim(); $('#acode').focus();
    }
  },
  'auth-code'() {
    const code = $('#acode').value.replace(/\D/g, '');
    if (code.length < 6) return toast('Enter the 6-digit code');
    signIn($('#ae').value); closeSheet(); render(); toast('Welcome back, ' + firstName());
  },
  'auth-demo'() { $('#ae').value = DEMO_EMAIL; },
  'auth-switch'(el) { authSheet(el.dataset.v); },
  'quick-account'(el) {
    const b = S.bookings.find(x => x.id === el.dataset.id);
    createAccount(b.contact);
    const a = b.address; if (a && !S.saved.some(x => x.line === a.line)) S.saved.push({ label: S.saved.length ? 'Other' : 'Home', line: a.line, unit: a.unit || '' });
    save(); render(); toast('Account created');
  },
  'dismiss-acct'(el) { const b = S.bookings.find(x => x.id === el.dataset.id); b.noAcct = true; save(); render(); },
  signout() { signOut(); location.hash = '#/'; render(); toast('Signed out'); },
  'item-add'() { const d = draft(); if (d.items.length < d.gifts) d.items.push({ who: '', what: 'Box' }); save(); render(); },
  'item-del'(el) { draft().items.splice(+el.dataset.i, 1); save(); render(); },
  'item-type'(el) { draft().items[+el.dataset.i].what = el.dataset.v; save(); render(); },
  'photo-del'(el) { draft().photos.splice(+el.dataset.i, 1); save(); render(); },
  install() { if (!deferredInstall) return; deferredInstall.prompt(); deferredInstall.userChoice.finally(() => { deferredInstall = null; render(); }); },
  'install-dismiss'() { try { localStorage.setItem('ribbon-install-off', '1'); } catch { /* ignore */ } render(); },
  print() { window.print(); },
  async share(el) {
    const b = S.bookings.find(x => x.id === el.dataset.id), text = `Camille from Ribbon & Co. is wrapping my gifts on ${dayShort(b.date)} at ${hourLabel(+b.time)}.`;
    try { if (navigator.share) { await navigator.share({ title: 'Ribbon & Co.', text, url: location.origin + location.pathname }); return; } } catch (e) { if (e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text + ' ' + location.origin + location.pathname); toast('Copied to clipboard'); } catch { toast('Sharing isn’t available here'); }
  },
  'review-save'(el) { const v = $('#rv').value.trim(); if (!v) return toast('Write a few words first'); S.bookings.find(x => x.id === el.dataset.id).review = v; save(); render(); toast('Thank you for your review'); },
  'remember-toggle'() { const d = draft(); d.remember = !d.remember; save(); render(); },
  'occ-add'() { occSheet(); },
  'occ-edit'(el) { occSheet(el.dataset.id); },
  'occ-kind'(el) { pendKind = el.dataset.v; document.querySelectorAll('[data-act=occ-kind]').forEach(c => c.classList.toggle('on', c === el)); $('#oc-lbl').textContent = pendKind === 'Birthday' ? 'Whose birthday?' : 'Who is celebrating?'; },
  'occ-save'(el) {
    const who = $('#oc-who').value.trim(), date = $('#oc-date').value;
    if (pendKind === 'Birthday' && !who) return toast('Whose birthday is it?');
    if (!date) return toast('Please choose the date');
    const o = el.dataset.id && S.occasions.find(x => x.id === el.dataset.id);
    if (o) Object.assign(o, { kind: pendKind, who, date }); else S.occasions.push({ id: 'o' + Date.now(), kind: pendKind, who, date, history: [] });
    save(); closeSheet(); render(); toast('We’ll remember it');
  },
  'occ-del'(el) { S.occasions = S.occasions.filter(x => x.id !== el.dataset.id); save(); closeSheet(); render(); toast('Occasion removed'); },
  'occ-snooze'(el) { S.occasions.find(x => x.id === el.dataset.id).snooze = iso(plusDays(7)); save(); render(); toast('We’ll remind you next week'); },
  'occ-book'(el) {
    const o = S.occasions.find(x => x.id === el.dataset.id), l = lastWrap(o), d = newDraft(l ? l.pkg : 'signature'), nx = nextOcc(o);
    Object.assign(d, { occasion: o.kind === 'Wedding' ? 'Wedding' : o.kind, occId: o.id, items: (l?.items || []).map(i => ({ ...i })) });
    if (l) Object.assign(d, { gifts: l.gifts, palette: l.palette, addons: (l.addons || []).filter(id => id !== 'card'), address: l.address ? { ...l.address } : null });
    if (l) { d.perk = true; if (!d.addons.includes('seal')) d.addons.push('seal'); }
    const mins = durMins(d); d.date = firstOpenDate(mins);
    for (let i = 0; i < Math.min(nx.days, 60); i++) { const k = iso(plusDays(i)); if (openCount(k, mins)) { d.date = k; break; } }
    S.draft = d; save(); location.hash = '#/customize';
  },
  soon() { toast('Not part of this demo'); },
  reset() {
    openSheet(`<h3>Reset demo?</h3><p class="muted small">This clears every booking and account on this device and starts again as a new guest.</p>
      <button class="btn mt16" data-act="reset-yes">Reset</button><button class="btn ghost mt8" data-act="close">Cancel</button>`);
  },
  'reset-yes'() { S = guestState(); ACC = {}; try { localStorage.removeItem(ACC_KEY); } catch { /* ignore */ } save(); closeSheet(); toast('Demo reset'); location.hash = '#/'; render(); },
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const fn = actions[el.dataset.act]; if (!fn) return;
  if (el.tagName !== 'A') e.preventDefault();
  fn(el, e);
});
document.addEventListener('change', e => {
  if (e.target.id !== 'photo' || !e.target.files[0]) return;
  const img = new Image(), url = URL.createObjectURL(e.target.files[0]);
  img.onload = () => {
    const k = Math.min(1, 360 / Math.max(img.width, img.height)), c = document.createElement('canvas');
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url); draft().photos.push(c.toDataURL('image/jpeg', 0.7)); save(); render();
  };
  img.onerror = () => { URL.revokeObjectURL(url); toast('That image couldn’t be read'); };
  img.src = url;
});
document.addEventListener('input', e => {
  const k = e.target.dataset && e.target.dataset.bind; if (!k) return;
  bind(k, e.target.value);
  const btn = $('#bookbtn'); if (btn) { const ok = contactOk(); btn.disabled = !ok; btn.textContent = ok ? 'Book · ' + money(quote(draft()).total) : 'Add your details to book'; }
});

/* ---------- Boot ---------- */
if (!location.hash) location.replace('#/');
render();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { /* offline support optional */ });
