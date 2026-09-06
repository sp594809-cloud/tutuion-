# Invoice and Receipt System (Updated)

This patch updates the previous invoice UI into a tuition receipt system (no GST), tailored for small tuitions.

Changes made:
- Replaced "Invoice" semantics with "Receipt" (Receipt number, Payment mode, Transaction/UPI ID, Amount Paid, Balance)
- Removed tax/GST calculation — receipts show total amount, amount paid, and balance
- Save receipts to localStorage under `tuition_receipts` (for demo/demo-only persistence)
- Printable receipt template updated with signature area and a clear "No GST" note

Files updated:
- src/components/InvoiceEditor.tsx — now saves receipts and collects payment mode/txn id/amount paid
- src/components/InvoicePrint.tsx — printable receipt format
- src/INVOICE_PATCH_README.md updated previously to note receipts

Next steps (recommended):
- Persist receipts to backend DB and secure endpoints
- Add emailing (send receipt PDF to parent) and SMS notifications for payments
- Add UPI QR generation for receipts if you want the printed receipt to show a QR for instant payment

