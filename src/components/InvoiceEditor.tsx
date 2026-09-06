import React, { useMemo, useState } from 'react';
import { InvoicePrint } from './InvoicePrint';

export function InvoiceEditor() {
  const [studentName, setStudentName] = useState('');
  const [items, setItems] = useState([{ desc: 'Tuition Fee', qty: 1, price: 500 }]);
  const [invoiceNumber, setInvoiceNumber] = useState(() => `INV-${Date.now()}`);
  const [date] = useState(() => new Date().toLocaleDateString());

  const subtotal = useMemo(() => items.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0), [items]);
  const tax = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const total = subtotal + tax;

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
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Invoice</title>');
    w.document.write('<style>body{font-family:Inter, system-ui, -apple-system, Roboto, Arial; padding:20px} table{width:100%;border-collapse:collapse} th,td{padding:8px;border:1px solid #ddd;text-align:left} .right{text-align:right} .no-border{border:none}</style>');
    w.document.write('</head><body>');
    w.document.write(invoiceHtml);
    w.document.write('<script>window.onload = function(){ window.print(); };</script>');
    w.document.write('</body></html>');
    w.document.close();
  }

  // Save invoice to localStorage (basic persistence)
  function saveInvoice() {
    try {
      const saved = JSON.parse(localStorage.getItem('tuition_invoices' ) || '[]');
      saved.push({ invoiceNumber, date, studentName, items, subtotal, tax, total });
      localStorage.setItem('tuition_invoices', JSON.stringify(saved));
      alert('Invoice saved locally. You can find it in localStorage for now.');
    } catch (e) {
      console.error(e);
      alert('Save failed');
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <label style={{ minWidth: 120 }}>Student name</label>
        <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Name" />
        <label style={{ minWidth: 120 }}>Invoice #</label>
        <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
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
        <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
        <div>Tax (18%): ₹{tax.toFixed(2)}</div>
        <div style={{ fontWeight: 'bold' }}>Total: ₹{total.toFixed(2)}</div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={previewAndPrint}>Preview & Print (PDF)</button>
        <button onClick={saveInvoice}>Save Invoice</button>
      </div>

      <div style={{ marginTop: 20 }} aria-hidden>
        <div id="invoice-print" style={{ maxWidth: 800, margin: '0 auto', padding: 20, border: '1px solid #eee' }}>
          <InvoicePrint invoiceNumber={invoiceNumber} date={date} studentName={studentName} items={items} subtotal={subtotal} tax={tax} total={total} />
        </div>
      </div>
    </div>
  );
}
