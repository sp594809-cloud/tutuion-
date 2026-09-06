@@
 import { InvoiceEditor } from '@/components/InvoiceEditor';
 import { ExportMarks } from '@/components/ExportMarks';
+import { ReceiptsList } from '@/components/ReceiptsList';
@@
       <section style={{ marginTop: 20 }}>
         <h2>Create / Print Invoice</h2>
         <InvoiceEditor />
       </section>
 
+      <section style={{ marginTop: 28 }}>
+        <h2>Saved Receipts</h2>
+        <ReceiptsList />
+      </section>
+
       <section style={{ marginTop: 40 }}>
         <h2>Export Student Performance & Leaderboard</h2>
         <ExportMarks />
       </section>
