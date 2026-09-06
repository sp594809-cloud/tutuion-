diff --git a/src/components/shell.tsx b/src/components/shell.tsx
index 6b567b8..0000000 100644
--- a/src/components/shell.tsx
+++ b/src/components/shell.tsx
@@
   {
     to: "/fees",
     label: "Fees",
     icon: Wallet,
     match: (p: string) => p.startsWith("/fees"),
   },
+  {
+    to: "/invoices",
+    label: "Receipts",
+    icon: FileText,
+    match: (p: string) => p.startsWith("/invoices"),
+  },
   {
     to: "/more",
     label: "More",
     icon: LayoutGrid,
     match: (p: string) =>
       p.startsWith("/more") ||
       p.startsWith("/batches") ||
       p.startsWith("/marks") ||
       p.startsWith("/reports") ||
       p.startsWith("/faculty"),
   },
 ] as const;
