import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Attendance,
  AttendStatus,
  Batch,
  Mark,
  PayMode,
  Payment,
  Student,
  TeacherProfile,
  Test,
} from "@/lib/types";
import { todayISO, uid } from "@/lib/utils";
import {
  syncStudentToDb,
  removeStudentFromDb,
  syncAttendanceToDb,
  syncMarksToDb,
  syncPaymentToDb,
  syncTeacherToDb,
} from "@/lib/server-db";

export type TuitionState = {

  institute: string;
  teachers: TeacherProfile[];
  activeTeacherId: string | null;
  batches: Batch[];
  students: Student[];
  attendance: Attendance[];
  payments: Payment[];
  tests: Test[];
  marks: Mark[];

  // Actions
  setInstitute: (name: string) => void;
  addTeacher: (t: Omit<TeacherProfile, "id">) => string;
  updateTeacher: (id: string, patch: Partial<TeacherProfile>) => void;
  setActiveTeacher: (id: string | null) => void;
  deleteTeacher: (id: string) => void;

  addBatch: (b: Omit<Batch, "id">) => string;
  updateBatch: (id: string, patch: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;
  addStudent: (s: Omit<Student, "id">) => string;
  updateStudent: (id: string, patch: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  saveAttendance: (
    batchId: string,
    date: string,
    rows: { studentId: string; status: AttendStatus }[],
  ) => void;
  collectFee: (studentId: string, amount: number, mode: PayMode, date?: string) => void;
  chargeMonth: () => void;
  addTest: (t: Omit<Test, "id">) => string;
  saveMarks: (testId: string, rows: { studentId: string; score: number }[]) => void;
};

function seedData(): Pick<
  TuitionState,
  "institute" | "teachers" | "activeTeacherId" | "batches" | "students" | "attendance" | "payments" | "tests" | "marks"
> {
  const b1 = "batch-maths";
  const b2 = "batch-science";
  const b3 = "batch-english";

  const t1: TeacherProfile = {
    id: "teacher-suhag",
    name: "Suhag Patel",
    email: "suhag.patel@sunrise.com",
    phone: "9737948529",
    instituteName: "Sunrise Tuition Academy",
    subjects: ["Maths", "Physics"],
    role: "Institute Owner & Senior Faculty",
  };

  const t2: TeacherProfile = {
    id: "teacher-neha",
    name: "Neha Sharma",
    email: "neha.sharma@sunrise.com",
    phone: "9876543210",
    instituteName: "Sunrise Tuition Academy",
    subjects: ["Science", "Chemistry"],
    role: "Subject Faculty",
  };

  const ids = {
    rahul: "st-rahul",
    priya: "st-priya",
    aman: "st-aman",
    sneha: "st-sneha",
    arjun: "st-arjun",
    meera: "st-meera",
    kabir: "st-kabir",
    ananya: "st-ananya",
    rohan: "st-rohan",
  };

  const s = (
    id: string,
    name: string,
    parent: string,
    phone: string,
    batchId: string,
    fee: number,
    due: number,
    studentPhone?: string,
  ): Student => ({
    id,
    name,
    parentName: parent,
    parentPhone: phone,
    studentPhone,
    batchId,
    monthlyFee: fee,
    dueAmount: due,
    joinedAt: "2026-04-01",
  });

  const students: Student[] = [
    s(ids.rahul, "Rahul Sharma", "Suresh Sharma", "9876543210", b1, 2500, 2500, "9876599901"),
    s(ids.priya, "Priya Patel", "Neha Patel", "9876543211", b1, 2500, 0, "9876599902"),
    s(ids.aman, "Aman Verma", "Rakesh Verma", "9876543212", b1, 2500, 2500),
    s(ids.sneha, "Sneha Joshi", "Anita Joshi", "9876501111", b2, 1800, 1800),
    s(ids.arjun, "Arjun Singh", "Vikram Singh", "9876502222", b2, 1800, 0),
    s(ids.meera, "Meera Nair", "Lakshmi Nair", "9876503333", b2, 1800, 3600),
    s(ids.kabir, "Kabir Khan", "Imran Khan", "9876504444", b3, 1200, 1200),
    s(ids.ananya, "Ananya Iyer", "Revathi Iyer", "9876505555", b3, 1200, 0),
    s(ids.rohan, "Rohan Desai", "Nitin Desai", "9876506666", b3, 1200, 1200),
  ];

  const today = todayISO();
  const getDateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const dates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(getDateOffset);

  const attendance: Attendance[] = [];
  dates.forEach((d, idx) => {
    students.forEach((st) => {
      let status: AttendStatus = "present";
      if (st.id === ids.aman && idx % 3 === 0) status = "absent";
      if (st.id === ids.meera && idx % 2 === 0) status = "absent";
      if (st.id === ids.rohan && idx > 5) status = "absent";
      if (st.id === ids.rahul && idx === 4) status = "absent";

      attendance.push({
        id: `att-${st.id}-${d}`,
        studentId: st.id,
        batchId: st.batchId,
        date: d,
        status,
        markedByTeacherId: t1.id,
      });
    });
  });

  const payments: Payment[] = students
    .filter((st) => st.dueAmount === 0)
    .map((st) => ({
      id: `pay-${st.id}`,
      studentId: st.id,
      amount: st.monthlyFee,
      date: today,
      mode: "upi" as const,
    }));

  const t1_id = "test-ch1";
  const t2_id = "test-ch2";
  const t3_id = "test-ch3";
  const t4_id = "test-ch5";

  const tests: Test[] = [
    { id: t1_id, batchId: b1, name: "Algebra Basics", maxMarks: 50, date: getDateOffset(25), createdById: t1.id },
    { id: t2_id, batchId: b1, name: "Geometry & Triangles", maxMarks: 50, date: getDateOffset(18), createdById: t1.id },
    { id: t3_id, batchId: b1, name: "Trigonometry Unit Test", maxMarks: 40, date: getDateOffset(10), createdById: t1.id },
    { id: t4_id, batchId: b1, name: "Quadratic Equations", maxMarks: 40, date: getDateOffset(2), createdById: t1.id },
  ];

  const marks: Mark[] = [
    { id: "mk-1-1", testId: t1_id, studentId: ids.rahul, score: 42 },
    { id: "mk-1-2", testId: t1_id, studentId: ids.priya, score: 48 },
    { id: "mk-1-3", testId: t1_id, studentId: ids.aman, score: 31 },

    { id: "mk-2-1", testId: t2_id, studentId: ids.rahul, score: 39 },
    { id: "mk-2-2", testId: t2_id, studentId: ids.priya, score: 46 },
    { id: "mk-2-3", testId: t2_id, studentId: ids.aman, score: 26 },

    { id: "mk-3-1", testId: t3_id, studentId: ids.rahul, score: 32 },
    { id: "mk-3-2", testId: t3_id, studentId: ids.priya, score: 39 },
    { id: "mk-3-3", testId: t3_id, studentId: ids.aman, score: 22 },

    { id: "mk-4-1", testId: t4_id, studentId: ids.rahul, score: 34 },
    { id: "mk-4-2", testId: t4_id, studentId: ids.priya, score: 38 },
    { id: "mk-4-3", testId: t4_id, studentId: ids.aman, score: 29 },
  ];

  return {
    institute: "Sunrise Tuition Academy",
    teachers: [t1, t2],
    activeTeacherId: t1.id,
    batches: [
      { id: b1, name: "Class 10 Maths", className: "10", subject: "Maths", monthlyFee: 2500 },
      { id: b2, name: "Class 9 Science", className: "9", subject: "Science", monthlyFee: 1800 },
      { id: b3, name: "Class 8 English", className: "8", subject: "English", monthlyFee: 1200 },
    ],
    students,
    attendance,
    payments,
    tests,
    marks,
  };
}

const seeded = seedData();

export const useTuition = create<TuitionState>()(
  persist(
    (set, get) => ({
      ...seeded,
      setInstitute: (institute) => set({ institute }),
      addTeacher: (t) => {
        const id = uid();
        const newTeacher: TeacherProfile = { ...t, id };
        set({
          teachers: [...get().teachers, newTeacher],
          activeTeacherId: id,
        });
        void syncTeacherToDb({ data: newTeacher });
        return id;
      },
      updateTeacher: (id, patch) => {
        set({
          teachers: get().teachers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        });
        const updated = get().teachers.find((t) => t.id === id);
        if (updated) void syncTeacherToDb({ data: updated });
      },
      setActiveTeacher: (id) => set({ activeTeacherId: id }),
      deleteTeacher: (id) =>
        set({
          teachers: get().teachers.filter((t) => t.id !== id),
          activeTeacherId: get().activeTeacherId === id ? (get().teachers[0]?.id ?? null) : get().activeTeacherId,
        }),

      addBatch: (b) => {
        const id = uid();
        set({ batches: [...get().batches, { ...b, id }] });
        return id;
      },
      updateBatch: (id, patch) =>
        set({ batches: get().batches.map((b) => (b.id === id ? { ...b, ...patch } : b)) }),
      deleteBatch: (id) =>
        set({
          batches: get().batches.filter((b) => b.id !== id),
          students: get().students.filter((s) => s.batchId !== id),
        }),
      addStudent: (s) => {
        const id = uid();
        const newStudent: Student = { ...s, id };
        set({ students: [...get().students, newStudent] });
        void syncStudentToDb({ data: newStudent });
        return id;
      },
      updateStudent: (id, patch) => {
        set({ students: get().students.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
        const updated = get().students.find((s) => s.id === id);
        if (updated) void syncStudentToDb({ data: updated });
      },
      deleteStudent: (id) => {
        set({
          students: get().students.filter((s) => s.id !== id),
          attendance: get().attendance.filter((a) => a.studentId !== id),
          payments: get().payments.filter((p) => p.studentId !== id),
          marks: get().marks.filter((m) => m.studentId !== id),
        });
        void removeStudentFromDb({ data: { id } });
      },
      saveAttendance: (batchId, date, rows) => {
        const activeTId = get().activeTeacherId;
        const rest = get().attendance.filter((a) => !(a.batchId === batchId && a.date === date));
        const next: Attendance[] = rows.map((r) => ({
          id: uid(),
          studentId: r.studentId,
          batchId,
          date,
          status: r.status,
          markedByTeacherId: activeTId ?? undefined,
        }));
        set({ attendance: [...rest, ...next] });
        void syncAttendanceToDb({
          data: { rows: next.map((a) => ({ id: a.id, studentId: a.studentId, date: a.date, status: a.status })) },
        });
      },
      collectFee: (studentId, amount, mode, date = todayISO()) => {
        const student = get().students.find((s) => s.id === studentId);
        if (!student || amount <= 0) return;
        const payId = uid();
        set({
          students: get().students.map((s) =>
            s.id === studentId ? { ...s, dueAmount: Math.max(0, s.dueAmount - amount) } : s,
          ),
          payments: [{ id: payId, studentId, amount, date, mode }, ...get().payments],
        });
        void syncPaymentToDb({
          data: {
            id: payId,
            studentId,
            amount,
            status: "paid",
            dueDate: date,
            paidDate: date,
            invoiceNo: `INV-${payId.slice(0, 6).toUpperCase()}`,
          },
        });
      },
      chargeMonth: () =>
        set({
          students: get().students.map((s) => ({
            ...s,
            dueAmount: s.dueAmount + s.monthlyFee,
          })),
        }),
      addTest: (t) => {
        const id = uid();
        const activeTId = get().activeTeacherId;
        set({ tests: [{ ...t, id, createdById: activeTId ?? undefined }, ...get().tests] });
        return id;
      },
      saveMarks: (testId, rows) => {
        const rest = get().marks.filter((m) => m.testId !== testId);
        const test = get().tests.find((t) => t.id === testId);
        const newMarks: Mark[] = rows.map((r) => ({
          id: uid(),
          testId,
          studentId: r.studentId,
          score: r.score,
        }));
        set({ marks: [...rest, ...newMarks] });
        void syncMarksToDb({
          data: {
            rows: newMarks.map((m) => ({
              id: m.id,
              studentId: m.studentId,
              testName: test?.name ?? "Test",
              subject: test?.batchId ?? "General",
              score: m.score,
              maxScore: test?.maxMarks ?? 100,
              date: test?.date ?? todayISO(),
            })),
          },
        });
      },
    }),
    { name: "tuition-easy-v4" },
  ),
);
