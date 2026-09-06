import React from 'react';
import { fetchReceiptsFromDb } from '@/lib/server-db';

export function ReceiptsList() {
  const [receipts, setReceipts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res: any = await fetchReceiptsFromDb();
        if (cancelled) return;
        if (res && res.success) setReceipts(res.receipts || res.receipts || []);
        else setReceipts([]);
      } catch (e) {
        console.error(e);
        setReceipts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSendWhatsApp(r: any) {
    const { generateFeeReceiptWhatsApp, getWhatsAppLink } = require('@/lib/utils');
    const teacherPhone = '';
    const instituteName = '';
    const msg = generateFeeReceiptWhatsApp({
      studentName: r.student_name || r.studentName || 'Student',
      parentName: '',
      amountPaid: r.amount_paid || r.amountPaid || r.subtotal || 0,
      mode: r.payment_mode || r.paymentMode || 'Cash',
      paymentDate: r.date ? String(r.date) : new Date().toISOString().slice(0,10),
      remainingDue: r.balance || r.balance || 0,
      instituteName,
      teacherPhone,
    });
    const phone = '';
    window.open(getWhatsAppLink(phone, msg), '_blank');
  }

  if (loading) return <div className="p-4 text-sm text-muted">Loading receipts…</div>;
  if (receipts.length === 0) return <div className="p-4 text-sm text-muted">No receipts yet.</div>;

  return (
    <div className="space-y-2 p-4">
      {receipts.map((r: any) => (
        <div key={r.id} className="p-3 border rounded-md bg-surface flex items-center justify-between">
          <div>
            <div className="font-semibold">{r.student_name || r.studentName || '—'}</div>
            <div className="text-xs text-muted">{r.receipt_number || r.receiptNumber} · {r.date ? String(r.date).slice(0,10) : r.date}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { window.open('/invoices#' + (r.receipt_number || r.receiptNumber)); }} className="text-xs px-3 py-1 rounded bg-gray-100">View</button>
            <button onClick={() => handleSendWhatsApp(r)} className="text-xs px-3 py-1 rounded bg-emerald-600 text-white">Send</button>
          </div>
        </div>
      ))}
    </div>
  );
}
