# Ribbon & Co. — luxury gift-wrapping PWA (customer flow demo)

An Uber-style, mobile-first PWA where customers book a professional gift wrapper to come to them.
Everything is mocked client-side (no backend); state lives in `localStorage`.

## Run
```
python3 -m http.server 8000     # or any static server
# open http://localhost:8000 — on a phone, "Add to Home Screen" to install
```

## Demo flow
1. **Home** → *Book an appointment* (or tap a package)
2. **Package** — Classic / Signature / Atelier / Maison Couture
3. **Customize** — gift count, occasion, palette, add-ons, notes
4. **Schedule** — "Wrap me now" (same-day) or pick a day + slot (some slots are randomly booked)
5. **Address** — search (try "5th", "Greene"), saved places, or mock current location
6. **Review** — tip, payment, promo (`WRAP10`, `WELCOME15`), itemised total
7. **Confirmed** → **Booking page**: appointment card, status, your wrapper, order summary, prep checklist. Use the small "Demo: preview …" link to step through assigned → day of service → complete, then rate. Chat, cancel, add-to-calendar (.ics) and *Book again* work.

*Account → Reset demo data* restores the sample history.

Offline-capable via `sw.js`; installable via `manifest.webmanifest`.

## Also in the demo
- **Package detail sheets** — "View details & the ritual" on each package
- **Handwritten note card** add-on with your own message (shown on the booking page)
- **Reschedule** an upcoming booking from its booking page (free, tracked)
- **Wrap again** shortcut on Home for repeat customers, plus a holiday-season banner
- **Account**: saved addresses (add/remove), payment cards (add with brand detection/remove), gift cards & offers, concierge chat + FAQ, notification preferences

## One wrapper, limited availability
Camille is the only wrapper, so the calendar is a single shared resource:
- Open 9am–8pm, closed Sundays plus the odd private-commission day; other clients' appointments are mocked deterministically.
- Appointment length = package time + 8 min per extra gift, with a 30-min travel buffer either side. Only start times that fit are offered.
- Your own bookings block that time for new bookings; days show **Few left / Full / Closed**; a full or closed day offers the **next opening** and a **waiting list**.
- "Next available today" (+$15 priority) is a shortcut to the earliest free slot, and only appears if Camille is actually free.

## Accounts: guest first, ask at the moment of value
- Browse and book without signing in. Guest checkout asks only for name, email and mobile (needed for the booking anyway); Apple/Google express buttons pre-fill them. "Already a client? Sign in" is available at that step.
- **After the booking is confirmed** — when the benefit is obvious — a one-tap "Create my account" card appears. It is passwordless and re-uses the details and address already given. "Not now" dismisses it for good.
- The Account tab and an empty Bookings tab carry a quiet invitation; nothing blocks or nags elsewhere.
- Sign in with an email + 6-digit code (any digits work). **Use the demo account** loads Josh Walker with two past bookings, saved addresses and cards; any email you created earlier comes back with its bookings. Guest bookings are merged into the account on sign-in.

## Deploy (GitHub Pages)
`.github/workflows/pages.yml` publishes the site on every push to `main`. One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The site is then served at `https://<owner>.github.io/gift-wrap-pwa/` (all paths are relative, so the subpath works for the PWA install and service worker).

## More features
- **Your gifts**: list what's being wrapped (recipient + type) and attach up to 3 photos (resized in-browser); shown on the booking page so Camille arrives prepared.
- **Booking page**: countdown ("Tomorrow", "In 3 days"), Share (Web Share, falling back to copy), written review after rating.
- **Receipts**: itemised, printable / save-as-PDF.
- **Install prompt**: native install button on Chromium, "Add to Home Screen" hint on iOS Safari; dismissible.

## Occasions: remembered annual dates
The retention loop, written in a jeweller's voice rather than a discount-code one.
- **Make it a tradition** (customize step, for Birthday / Anniversary / Wedding): add a name and date and the app remembers it every year. Works for guests too; occasions move into the account when one is created.
- **A note from Camille**: three weeks before a remembered date, Home leads with a personal letter: the date, any milestone (70th birthday, Silver/Pearl/Ruby anniversary when the original year is known), what was wrapped last time, and live availability from Camille's calendar before the day. "Remind me later" snoozes it a week.
- **Occasions tab**: every remembered date, countdown, last wrap, Reserve / Edit / Remove; add dates any time.
- **Reserve in one tap**: pre-fills last year's package, palette, gifts, address and finishing touches, picks the first open date before the occasion, suggests something new, and includes a **complimentary monogram wax seal** for returning traditions.
- **Confirmation** celebrates the tradition ("Year 2 together"); receipts itemise the complimentary seal. Reminders can be switched off under Notifications.
- Demo account has three sample occasions dated relative to today (Mum's 70th in 12 days, a Silver anniversary, Eleanor's birthday).

## The Holiday Season: a reservation event, not a rush
- **Invitation first**: returning clients and members can reserve the December diary now; everyone else from Nov 1 (guests see a locked-date card with *Sign in* and *Notify me*).
- **Honest scarcity**: the diary shows how much of December (and the peak week) is genuinely reserved, from Camille's single calendar.
- **Deposit, not surge pricing**: holiday dates take a 25% deposit; the balance is taken after the service. Peak dates (Dec 17–23) carry a clearly labelled $40 appointment fee. Camille is away on the 24th and 25th.
- **Reserve early**: complimentary hand-lettered tags on any holiday date reserved by Nov 15; free changes until Nov 24, after which the deposit is retained.
- **Diary calendar** (`#/diary`): month view of Camille's availability with Open / Few left / Full / Peak / Invitation states, reachable from the schedule step and the season page (`#/season`).

## Introductions (referrals)
A private invitation rather than a referral link: each member has a personal code and an engraved-style invitation card. A friend arriving via `?invite=CODE` is welcomed on Home and receives $30 off their first appointment; the member earns $30 Ribbon credit when the friend's first appointment completes, applied automatically at checkout. A "Circle" ladder rewards 3 and 5 introductions. Prompted after a completed, rated booking and from the Account tab; *Demo: simulate a friend's progress* walks a friend through invited → booked → completed.

## Also in the demo
- **Letters**: a quiet in-app inbox (booking updates, Camille's notes, season invitation, credit earned) with an unread dot on the Account tab.
- **Gift card redemption**: enter a purchased `RC-XXXX-XXXX` code in the promo field at checkout and its value becomes Ribbon credit (single use, works across accounts on the same device).
- **Gratuity after service**: optional $10 / $20 / $40 on a completed booking, shown on the receipt.
- **Accessibility**: visible focus rings, Esc closes dialogs and returns focus.
