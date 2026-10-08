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
