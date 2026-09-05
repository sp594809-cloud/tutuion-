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

export const syncMarksToDb = createServerFn({ method: "POST" })
  .validator(
    (data: {
      rows: Array<{
        id: string;
        studentId: string;
        testName: string;
        subject: string;
        score: number;
        maxScore: number;
        date: string;
      }>;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      for (const r of data.rows) {
        await sql`
          INSERT INTO marks (id, student_id, test_name, subject, score, max_score, date)
          VALUES (${r.id}, ${r.studentId}, ${r.testName}, ${r.subject}, ${r.score}, ${r.maxScore}, ${r.date})
          ON CONFLICT (id) DO UPDATE SET score = EXCLUDED.score
        `;
      }
      return { success: true };
    } catch (err) {
      console.error("[syncMarksToDb] Error:", err);
      return { success: false, error: String(err) };
    }
  });

export const syncPaymentToDb = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      studentId: string;
      amount: number;
      status: string;
      dueDate: string;
      paidDate: string | null;
      invoiceNo: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await sql`
        INSERT INTO fee_payments (id, student_id, amount, status, due_date, paid_date, invoice_no)
        VALUES (${data.id}, ${data.studentId}, ${data.amount}, ${data.status}, ${data.dueDate}, ${data.paidDate}, ${data.invoiceNo})
        ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, paid_date = EXCLUDED.paid_date
      `;
      return { success: true };
    } catch (err) {
      console.error("[syncPaymentToDb] Error:", err);
      return { success: false, error: String(err) };
    }
  });

export const syncTeacherToDb = createServerFn({ method: "POST" })
  .validator((data: TeacherProfile) => data)
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await sql`
        INSERT INTO teachers (id, name, tuition_name, phone, email, subjects)
        VALUES (${data.id}, ${data.name}, ${data.instituteName}, ${data.phone}, ${data.email}, ${JSON.stringify(data.subjects)})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          tuition_name = EXCLUDED.tuition_name,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          subjects = EXCLUDED.subjects
      `;
      return { success: true };
    } catch (err) {
      console.error("[syncTeacherToDb] Error:", err);
      return { success: false, error: String(err) };
    }
  });

export const syncPaperToDb = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      title: string;
      subject: string;
      batchId: string;
      fileUrl: string;
      notes?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await sql`
        INSERT INTO question_papers (id, title, subject, batch, file_url, notes)
        VALUES (${data.id}, ${data.title}, ${data.subject}, ${data.batchId}, ${data.fileUrl}, ${data.notes || null})
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          subject = EXCLUDED.subject,
          batch = EXCLUDED.batch,
          file_url = EXCLUDED.file_url,
          notes = EXCLUDED.notes
      `;
      return { success: true };
    } catch (err) {
      console.error("[syncPaperToDb] Error:", err);
      return { success: false, error: String(err) };
    }
  });

export const deletePaperFromDb = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await sql`DELETE FROM question_papers WHERE id = ${data.id}`;
      return { success: true };
    } catch (err) {
      console.error("[deletePaperFromDb] Error:", err);
      return { success: false, error: String(err) };
    }
  });

