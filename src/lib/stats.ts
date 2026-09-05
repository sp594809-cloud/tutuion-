import type { Attendance, Mark, Student, Test } from "@/lib/types";
import { monthKey, todayISO } from "@/lib/utils";

export function monthAttendance(attendance: Attendance[], month = monthKey()) {
  const rows = attendance.filter((a) => a.date.startsWith(month));
  const present = rows.filter((a) => a.status === "present").length;
  const absent = rows.length - present;
  const pct = rows.length ? Math.round((present / rows.length) * 100) : 0;
  return { rows, present, absent, pct, total: rows.length };
}

export function todayAttendance(attendance: Attendance[], studentCount: number, date = todayISO()) {
  const rows = attendance.filter((a) => a.date === date);
  const present = rows.filter((a) => a.status === "present").length;
  const absent = rows.filter((a) => a.status === "absent").length;
  const unmarked = Math.max(0, studentCount - rows.length);
  return { present, absent, unmarked, marked: rows.length };
}

export function studentMonthPct(
  attendance: Attendance[],
  studentId: string,
  month = monthKey(),
) {
  const rows = attendance.filter((a) => a.studentId === studentId && a.date.startsWith(month));
  if (!rows.length) return null;
  const present = rows.filter((a) => a.status === "present").length;
  return Math.round((present / rows.length) * 100);
}

export function rankingForTest(
  test: Test,
  students: Student[],
  marks: Mark[],
) {
  return students
    .filter((s) => s.batchId === test.batchId)
    .map((s) => {
      const m = marks.find((x) => x.testId === test.id && x.studentId === s.id);
      const score = m?.score ?? 0;
      const pct = test.maxMarks ? Math.round((score / test.maxMarks) * 100) : 0;
      return { student: s, score, pct, max: test.maxMarks };
    })
    .sort((a, b) => b.score - a.score);
}

export function testAverage(test: Test, marks: Mark[]) {
  const rows = marks.filter((m) => m.testId === test.id);
  if (!rows.length) return 0;
  const avg = rows.reduce((a, m) => a + m.score, 0) / rows.length;
  return test.maxMarks ? Math.round((avg / test.maxMarks) * 100) : 0;
}
