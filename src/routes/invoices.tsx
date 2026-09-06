import { createFileRoute } from "@tanstack/react-router";
import { InvoiceEditor } from '@/components/InvoiceEditor';
import { ExportMarks } from '@/components/ExportMarks';
import { ReceiptsList } from '@/components/ReceiptsList';

export const Route = createFileRoute("/invoices")({ component: InvoicesPage });

function InvoicesPage() {
  return (
    <div className="px-4 pt-4 space-y-6">
      <section style={{ marginTop: 20 }}>
        <h2 className="text-lg font-semibold">Create / Print Invoice</h2>
        <InvoiceEditor />
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 className="text-lg font-semibold">Saved Receipts</h2>
        <ReceiptsList />
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 className="text-lg font-semibold">Export Student Performance & Leaderboard</h2>
        <ExportMarks />
      </section>
    </div>
  );
}
