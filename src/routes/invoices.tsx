import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { InvoiceEditor } from '@/components/InvoiceEditor';
import { ExportMarks } from '@/components/ExportMarks';

export default function InvoicesPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Invoices & Reports</h1>
      <p>Create and print invoices (bills) for students, export performance data, and view leaderboards.</p>

      <section style={{ marginTop: 20 }}>
        <h2>Create / Print Invoice</h2>
        <InvoiceEditor />
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Export Student Performance & Leaderboard</h2>
        <ExportMarks />
      </section>

      <p style={{ marginTop: 30 }}>
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  );
}
