import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import type { Student, TeacherProfile } from "@/lib/types";

export type DbSyncData = {
  students: any[];
  attendance: any[];
  marks: any[];
  payments: any[];
  teachers: any[];
};

export const fetchAllDataFromDb = createServerFn({ method: "GET" }).handler(async (): Promise<DbSyncData> => {
  try {
    const sql = await getSql();
    const students = await sql<any>`SELECT * FROM students ORDER BY created_at ASC`;
    const attendance = await sql<any>`SELECT * FROM attendance ORDER BY created_at ASC`;
    const marks = await sql<any>`SELECT * FROM marks ORDER BY created_at ASC`;
    const payments = await sql<any>`SELECT * FROM fee_payments ORDER BY created_at ASC`;
    const teachers = await sql<any>`SELECT * FROM teachers ORDER BY created_at ASC`;

    return { students, attendance, marks, payments, teachers };
  } catch (err) {
    console.error("[fetchFromDb] Failed:", err);
    return { students: [], attendance: [], marks: [], payments: [], teachers: [] };
  }
});

export const syncStudentToDb = createServerFn({ method: "POST" })
  .validator((data: Student) => data)
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await sql`
        INSERT INTO students (id, name, roll_number, batch, parent_phone, student_phone, target_exam)
        VALUES (
          ${data.id},
          ${data.name},
          ${data.id},
          ${data.batchId},
          ${data.parentPhone},
          ${data.studentPhone || null},
          ${data.batchId}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          batch = EXCLUDED.batch,
          parent_phone = EXCLUDED.parent_phone,
          student_phone = EXCLUDED.student_phone
      `;
      return { success: true };
    } catch (err) {
      console.error("[syncStudentToDb] Error:", err);
      return { success: false, error: String(err) };
    }
  });

export const removeStudentFromDb = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await sql`DELETE FROM students WHERE id = ${data.id}`;
      return { success: true };
    } catch (err) {
      console.error("[removeStudentFromDb] Error:", err);
      return { success: false, error: String(err) };
    }
  });

export const syncAttendanceToDb = createServerFn({ method: "POST" })
  .validator((data: { rows: Array<{ id: string; studentId: string; date: string; status: string }> }) => data)
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      for (const r of data.rows) {
        await sql`
          INSERT INTO attendance (id, student_id, date, status)
          VALUES (${r.id}, ${r.studentId}, ${r.date}, ${r.status})
          ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status
        `;
      }
      return { success: true };
    } catch (err) {
      console.error("[syncAttendanceToDb] Error:", err);
      return { success: false, error: String(err) };
    }
  });

// --- Receipts / Receipt items server functions ---

export const syncReceiptToDb = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      // Upsert receipt
      await sql`
        INSERT INTO receipts (id, receipt_number, student_name, student_id, date, payment_mode, transaction_id, amount_paid, balance, subtotal, metadata)
        VALUES (
          ${data.id},
          ${data.receiptNumber},
          ${data.studentName},
          ${data.studentId || null},
          ${data.date},
          ${data.paymentMode},
          ${data.transactionId || null},
          ${data.amountPaid},
          ${data.balance},
          ${data.subtotal},
          ${JSON.stringify(data.metadata || {})}
        )
        ON CONFLICT (id) DO UPDATE SET
          receipt_number = EXCLUDED.receipt_number,
          student_name = EXCLUDED.student_name,
          student_id = EXCLUDED.student_id,
          date = EXCLUDED.date,
          payment_mode = EXCLUDED.payment_mode,
          transaction_id = EXCLUDED.transaction_id,
          amount_paid = EXCLUDED.amount_paid,
          balance = EXCLUDED.balance,
          subtotal = EXCLUDED.subtotal,
          metadata = EXCLUDED.metadata
      `;

      // Replace items: delete existing then insert provided
      await sql`DELETE FROM receipt_items WHERE receipt_id = ${data.id}`;
      if (Array.isArray(data.items)) {
        for (const it of data.items) {
          await sql`
            INSERT INTO receipt_items (receipt_id, description, qty, price, amount)
            VALUES (${data.id}, ${it.desc || it.description}, ${it.qty || 1}, ${it.price || 0}, ${(it.qty || 1) * (it.price || 0)})
          `;
        }
      }

      return { success: true };
    } catch (err) {
      console.error("[syncReceiptToDb] Error:", err);
      return { success: false, error: String(err) };
    }
  });

export const fetchReceiptsFromDb = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sql = await getSql();
    const rows = await sql<any>`
      SELECT r.*, COALESCE(json_agg(json_build_object('description', ri.description, 'qty', ri.qty, 'price', ri.price, 'amount', ri.amount)) FILTER (WHERE ri.id IS NOT NULL), '[]') AS items
      FROM receipts r
      LEFT JOIN receipt_items ri ON ri.receipt_id = r.id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `;
    return { success: true, receipts: rows };
  } catch (err) {
    console.error("[fetchReceiptsFromDb] Error:", err);
    return { success: false, receipts: [] };
  }
});
