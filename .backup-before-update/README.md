# Nails by Glossy Six

React + Tailwind CSS + Node/Express.

## Run it
```
npm install
npm run dev      # site at http://localhost:5173, API at :3001
```
Production: `npm run build && npm start` (Express serves the site at http://localhost:3001).

## Edit your content
- `src/data.js`: email, address, social links, services and prices (prices are placeholders)
- `tailwind.config.js`: colors and fonts
- Contact messages are saved to `server/messages.json` and bookings to `server/bookings.json`. To receive them by email, add `nodemailer` in `server/index.js`.
- Map location: `mapQuery` in `src/data.js`

## Admin
Go to `/admin` (there is a small "Admin" link in the footer). Default login: **admin / glossy2026**.
CHANGE IT before going online by setting environment variables `ADMIN_USER`, `ADMIN_PASS` and `SECRET`
(Windows PowerShell example: `$env:ADMIN_PASS="my-strong-password"; npm start`).
Bookings and receipts are stored in `server/data.json`. Back this file up.
