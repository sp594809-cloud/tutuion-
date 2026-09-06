import React from 'react';

export function ReceiptsList() {
  const [receipts, setReceipts] = React.useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('tuition_receipts');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  function refresh() {
    try {
      const raw = localStorage.getItem('tuition_receipts');
      setReceipts(raw ? JSON.parse(raw) : []);
    } catch {
      setReceipts([]);
    }
  }

  function handleSendWhatsApp(r: any) {
    const { generateFeeReceiptWhatsApp, getWhatsAppLink } = require('@/lib/utils');
    const teacherPhone = '';
    const instituteName = '';
    const msg = generateFeeReceiptWhatsApp({
      studentName: r.studentName || 'Student',
      parentName: '',
      amountPaid: r.amountPaid || r.subtotal || 0,
      mode: r.paymentMode || 'Cash',
      paymentDate: r.date || new Date().toISOString().slice(0,10),
      remainingDue: r.balance || 0,
      instituteName,
      teacherPhone,
    });
    const phone = '';
    window.open(getWhatsAppLink(phone, msg), '_blank');
  }

  if (receipts.length === 0) return <div className="p-4 text-sm text-muted">No receipts yet.</div>;

  return (
    <div className="space-y-2 p-4">
      {receipts.map((r: any) => (
        <div key={r.receiptNumber} className="p-3 border rounded-md bg-surface flex items-center justify-between">
          <div>
            <div className="font-semibold">{r.studentName || '—'}</div>
            <div className="text-xs text-muted">{r.receiptNumber} · {r.date}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { window.open('/invoices#' + r.receiptNumber); }} className="text-xs px-3 py-1 rounded bg-gray-100">View</button>
            <button onClick={() => handleSendWhatsApp(r)} className="text-xs px-3 py-1 rounded bg-emerald-600 text-white">Send</button>
          </div>
        </div>
      ))}
    </div>
  );
}
