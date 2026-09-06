# Invoice and Export System

This patch adds a lightweight invoice creation/print system and a student performance export/charting UI.

Files added:
- src/routes/invoices.tsx — New route (Invoices & Reports)
- src/components/InvoiceEditor.tsx — Invoice editor, save, preview/print
- src/components/InvoicePrint.tsx — Printable invoice layout (nice bill format)
- src/components/ExportMarks.tsx — Export CSV, download chart, leaderboard
- src/components/BarChart.tsx — Small SVG bar chart component
- public/manifest.webmanifest — (left in place from earlier patch) not modified here
- public/icons/README.md — icons instructions (if missing)

Persistence: invoices and sample students are saved to localStorage. For production, wire these components to your server APIs / database.

How to use:
- Visit /invoices in the app (please add route to app's navigation if needed).
- Create invoices and preview/print them (PDF via print dialog).
- Export student marks as CSV and download chart image; view leaderboard.

Next recommended steps:
- Wire student data and invoices to your backend (APIs) to persist across devices.
- Add authentication/authorization checks to ensure only teachers access invoices.
- Add email/SMS sending for invoice sharing (use a server function or 3rd-party provider).
