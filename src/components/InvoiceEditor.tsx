import React, { useMemo, useState } from 'react';
import { InvoicePrint } from './InvoicePrint';

export function InvoiceEditor() {
  const [studentName, setStudentName] = useState('');
  const [items, setItems] = useState([{ desc: 'Tuition Fee', qty: 1, price: 500 }]);
  const [receiptNumber, setReceiptNumber] = useState(() => `RCPT-${Date.now()}`);
  const [date] = useState(() => new Date().toLocaleDateString());
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [amountPaid, setAmountPaid] = useState(0);

  const subtotal = useMemo(() => items.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0), [items]);
  const balance = useMemo(() => Math.max(0, subtotal - (Number(amountPaid) || 0)), [subtotal, amountPaid]);

  function updateItem(index, key, value) {
    const next = items.slice();
    next[index] = { ...next[index], [key]: value };
    setItems(next);
  }

  function addItem() {
    setItems([...items, { desc: '', qty: 1, price: 0 }]);
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  function previewAndPrint() {
    const invoiceHtml = document.getElementById('invoice-print')?.outerHTML ?? '';
    const w = window.open('', '_blank');
    if (!w) return alert('Popup blocked');
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Receipt</title>');
    w.document.write('<style>body{font-family:Inter, system-ui, -apple-system, Roboto, Arial; padding:20px} table{width:100%;border-collapse:collapse} th,td{padding:8px;border:1px solid #ddd;text-align:left} .right{text-align:right} .no-border{border:none}</style>');
    w.document.write('</head><body>');
    w.document.write(invoiceHtml);
    w.document.write('<script>window.onload = function(){ window.print(); };</script>');
    w.document.write('</body></html>');
    w.document.close();
  }

  // Save receipt to localStorage (basic persistence)
  function saveReceipt() {
    try {
      const saved = JSON.parse(localStorage.getItem('tuition_receipts') || '[]');
      saved.push({ receiptNumber, date, studentName, items, subtotal, paymentMode, transactionId, amountPaid, balance });
      localStorage.setItem('tuition_receipts', JSON.stringify(saved));
      alert('Receipt saved locally. You can find it in localStorage for now.');
    } catch (e) {
      console.error(e);
      alert('Save failed');
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ minWidth: 120 }}>Student name</label>
        <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Name" />
        <label style={{ minWidth: 120 }}>Receipt #</label>
        <input value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} />
        <label style={{ minWidth: 40 }}>Date</label>
        <input value={date} readOnly />
      </div>

      <div style={{ marginTop: 12 }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '60%' }}>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
              <th className="no-border"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>
                  <input value={it.desc} onChange={(e) => updateItem(i, 'desc', e.target.value)} placeholder="Description" style={{ width: '100%' }} />
                </td>
                <td>
                  <input type="number" value={it.qty} onChange={(e) => updateItem(i, 'qty', Number(e.target.value))} style={{ width: 80 }} />
                </td>
                <td>
                  <input type="number" value={it.price} onChange={(e) => updateItem(i, 'price', Number(e.target.value))} style={{ width: 120 }} />
                </td>
                <td className="right">₹{(it.qty * it.price).toFixed(2)}</td>
                <td className="no-border"><button onClick={() => removeItem(i)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addItem} style={{ marginTop: 8 }}>Add item</button>
      </div>

      <div style={{ marginTop: 12, textAlign: 'right' }}>
        <div>Amount Due: ₹{subtotal.toFixed(2)}</div>
        <div style={{ marginTop: 8 }}>
          <label style={{ marginRight: 8 }}>Payment mode</label>
          <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
            <option>Cash</option>
            <option>UPI</option>
            <option>Bank Transfer</option>
            <option>Other</option>
          </select>
        </div>
        <div style={{ marginTop: 8 }}>
          <label style={{ marginRight: 8 }}>Transaction / UPI ID (optional)</label>
          <input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Txn / UPI ID" />
        </div>
        <div style={{ marginTop: 8 }}>
          <label style={{ marginRight: 8 }}>Amount Paid (₹)</label>
          <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} style={{ width: 160 }} />
        </div>
        <div style={{ fontWeight: 'bold', marginTop: 8 }}>Balance: ₹{balance.toFixed(2)}</div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={previewAndPrint}>Preview & Print Receipt</button>
        <button onClick={saveReceipt}>Save Receipt</button>
      </div>

      <div style={{ marginTop: 20 }} aria-hidden>
        <div id="invoice-print" style={{ maxWidth: 800, margin: '0 auto', padding: 20, border: '1px solid #eee' }}>
          <InvoicePrint
            invoiceNumber={receiptNumber}
            date={date}
            studentName={studentName}
            items={items}
            subtotal={subtotal}
            paymentMode={paymentMode}
            transactionId={transactionId}
            amountPaid={amountPaid}
            balance={balance}
          />
        </div>
      </div>
    </div>
  );
}
