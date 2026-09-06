import React from 'react';

export function InvoicePrint({ invoiceNumber, date, studentName, items, subtotal, tax, total }: any) {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, Roboto, Arial', color: '#111' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h2 style={{ margin: 0 }}>TuitionEasy</h2>
          <div>Teacher: Your Name</div>
          <div>Contact: +91-XXXXXXXXXX</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#666' }}>Invoice</div>
          <div style={{ fontWeight: 700 }}>{invoiceNumber}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{date}</div>
        </div>
      </header>

      <section style={{ marginBottom: 16 }}>
        <strong>Bill To:</strong>
        <div>{studentName || '— Student Name —'}</div>
      </section>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Description</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Qty</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Price</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td style={{ padding: 8 }}>{it.desc}</td>
              <td style={{ padding: 8 }}>{it.qty}</td>
              <td style={{ padding: 8 }}>₹{Number(it.price).toFixed(2)}</td>
              <td style={{ padding: 8 }}>₹{(it.qty * it.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} style={{ textAlign: 'right', padding: 8 }}>Subtotal</td>
            <td style={{ padding: 8 }}>₹{subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={3} style={{ textAlign: 'right', padding: 8 }}>Tax (18%)</td>
            <td style={{ padding: 8 }}>₹{tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={3} style={{ textAlign: 'right', padding: 8, fontWeight: 700 }}>Total</td>
            <td style={{ padding: 8, fontWeight: 700 }}>₹{total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <footer style={{ marginTop: 18, fontSize: 12, color: '#666' }}>
        <div>Bank details / UPI: provide here if you want to accept payments</div>
        <div style={{ marginTop: 8 }}>Thank you for trusting TuitionEasy.</div>
      </footer>
    </div>
  );
}
