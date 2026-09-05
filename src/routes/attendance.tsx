import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Calendar, CheckCircle2, LayoutDashboard, MessageSquare, UserCheck, UserX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button, Card, Select } from "@/components/ui";
import { useTuition } from "@/lib/store";
import { cn, getWhatsAppLink, prettyDate, todayISO } from "@/lib/utils";
import type { AttendStatus } from "@/lib/types";

export const Route = createFileRoute("/attendance")({ component: AttendancePage });

function AttendancePage() {
  const batches = useTuition((s) => s.batches);
  const students = useTuition((s) => s.students);
  const attendance = useTuition((s) => s.attendance);
  const saveAttendance = useTuition((s) => s.saveAttendance);
  const institute = useTuition((s) => s.institute);

  const [activeTab, setActiveTab] = useState<"mark" | "dashboard">("mark");
  const [batchId, setBatchId] = useState(batches[0]?.id ?? "");
  const [date, setDate] = useState(todayISO());
  const [saved, setSaved] = useState(false);

  const batchStudents = useMemo(
    () => students.filter((s) => s.batchId === batchId).sort((a, b) => a.name.localeCompare(b.name)),
    [students, batchId],
  );

  const existingKey = `${batchId}|${date}|${attendance
    .filter((a) => a.batchId === batchId && a.date === date)
    .map((a) => `${a.studentId}:${a.status}`)
    .join(",")}`;

  const [rows, setRows] = useState<Record<string, AttendStatus>>({});

  useEffect(() => {
    const next: Record<string, AttendStatus> = {};
    for (const a of attendance) {
      if (a.batchId === batchId && a.date === date) next[a.studentId] = a.status;
    }
    setRows(next);
    setSaved(false);
  }, [existingKey, batchId, date]);

  function setStatus(id: string, status: AttendStatus) {
    setRows((r) => ({ ...r, [id]: status }));
    setSaved(false);
  }

  // Bulk actions for 100-1000 students scale
  function markAll(status: AttendStatus) {
    const next: Record<string, AttendStatus> = {};
    batchStudents.forEach((s) => {
      next[s.id] = status;
    });
    setRows(next);
    setSaved(false);
  }

  const allMarked = batchStudents.length > 0 && batchStudents.every((s) => rows[s.id]);

  // Analytics for Attendance Dashboard (memoized for maximum performance)
  const dashboardData = useMemo(() => {
    const batchAtt = attendance.filter((a) => a.batchId === batchId);
    const uniqueDates = Array.from(new DateSet(batchAtt.map((a) => a.date))).sort();

    const dateStats = uniqueDates.map((d) => {
      const dayAtt = batchAtt.filter((a) => a.date === d);
      const total = dayAtt.length;
      const present = dayAtt.filter((a) => a.status === "present").length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      return {
        date: prettyDate(d),
        rawDate: d,
        present,
        absent: total - present,
        percentage,
      };
    });

    const studentStats = batchStudents.map((s) => {
      const sAtt = batchAtt.filter((a) => a.studentId === s.id);
      const total = sAtt.length;
      const present = sAtt.filter((a) => a.status === "present").length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 100;
      return {
        student: s,
        total,
        present,
        absent: total - present,
        percentage,
      };
    });

    const totalMarked = batchAtt.length;
    const totalPresent = batchAtt.filter((a) => a.status === "present").length;
    const avgPercentage = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 0;
    const lowAttendanceCount = studentStats.filter((st) => st.percentage < 75).length;

    return {
      dateStats,
      studentStats,
      avgPercentage,
      totalConducted: uniqueDates.length,
      lowAttendanceCount,
    };
  }, [attendance, batchId, batchStudents]);

  return (
    <div className="px-4 pt-4 space-y-4 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Attendance</h1>
        <div className="flex rounded-lg bg-surface p-1 ring-1 ring-border">
          <button
            type="button"
            onClick={() => setActiveTab("mark")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              activeTab === "mark" ? "bg-primary text-primary-fg shadow" : "text-muted hover:text-fg",
            )}
          >
            <Calendar className="size-3.5" />
            Marking
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              activeTab === "dashboard" ? "bg-primary text-primary-fg shadow" : "text-muted hover:text-fg",
            )}
          >
            <LayoutDashboard className="size-3.5" />
            Dashboard
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select className="w-full" value={batchId} onChange={(e) => setBatchId(e.target.value)}>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
      </div>

      {activeTab === "mark" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 w-full rounded-lg bg-surface px-3 text-base ring-1 ring-border outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Bulk Marking Buttons for 100-1000 Students Scale */}
          {batchStudents.length > 0 && (
            <div className="flex gap-2 bg-surface p-2 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => markAll("present")}
                className="flex-1 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all"
              >
                ✓ Mark All Present
              </button>
              <button
                type="button"
                onClick={() => markAll("absent")}
                className="flex-1 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all"
              >
                ✕ Mark All Absent
              </button>
            </div>
          )}

          {batchStudents.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No students in this batch.</p>
          ) : (
            <ul className="space-y-2">
              {batchStudents.map((s) => {
                const st = rows[s.id];
                const batchObj = batches.find((b) => b.id === batchId);
                const absentMsg = `Dear ${s.parentName || "Parent"}, ${s.name} was marked ABSENT today (${prettyDate(date)}) in ${batchObj?.name ?? "class"} at ${institute}.`;

                return (
                  <li
                    key={s.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-surface px-3.5 py-3 ring-1 ring-border shadow-sm"
                  >
                    <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0">
                      <span className="truncate font-semibold text-sm">{s.name}</span>
                      {st === "absent" && (
                        <a
                          href={getWhatsAppLink(s.parentPhone, absentMsg)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        >
                          <MessageSquare className="size-3" />
                          Notify Parent
                        </a>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setStatus(s.id, "present")}
                        className={cn(
                          "h-10 min-w-20 flex-1 sm:flex-initial rounded-lg text-xs font-bold transition-all ring-1",
                          st === "present"
                            ? "bg-emerald-600 text-white ring-emerald-600 shadow-md"
                            : "bg-bg text-muted ring-border hover:bg-surface",
                        )}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(s.id, "absent")}
                        className={cn(
                          "h-10 min-w-20 flex-1 sm:flex-initial rounded-lg text-xs font-bold transition-all ring-1",
                          st === "absent"
                            ? "bg-rose-600 text-white ring-rose-600 shadow-md"
                            : "bg-bg text-muted ring-border hover:bg-surface",
                        )}
                      >
                        Absent
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="pt-2">
            <Button
              className="w-full h-12 text-base font-bold shadow-lg"
              disabled={!allMarked}
              onClick={() => {
                saveAttendance(
                  batchId,
                  date,
                  batchStudents.map((s) => ({ studentId: s.id, status: rows[s.id] })),
                );
                setSaved(true);
              }}
            >
              {saved ? "✓ Attendance Saved" : "Save Attendance"}
            </Button>
            {!allMarked && batchStudents.length > 0 && (
              <p className="mt-2 text-center text-xs text-muted">Mark every student to enable save.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Card className="p-3.5 flex flex-col justify-between">
              <span className="text-xs text-muted font-medium">Batch Avg Attendance</span>
              <p className="mt-2 text-2xl font-black tracking-tight text-emerald-600">{dashboardData.avgPercentage}%</p>
            </Card>
            <Card className="p-3.5 flex flex-col justify-between">
              <span className="text-xs text-muted font-medium">Total Days Conducted</span>
              <p className="mt-2 text-2xl font-black tracking-tight">{dashboardData.totalConducted} days</p>
            </Card>
            <Card className="p-3.5 flex flex-col justify-between col-span-2 sm:col-span-1">
              <span className="text-xs text-muted font-medium">Needs Attention (&lt;75%)</span>
              <p className="mt-2 text-2xl font-black tracking-tight text-rose-500">{dashboardData.lowAttendanceCount} students</p>
            </Card>
          </div>

          {/* Low Attendance Warning Alert */}
          {dashboardData.lowAttendanceCount > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-rose-900 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sm mb-2">
                <AlertTriangle className="size-4 text-rose-600 shrink-0" />
                <span>Low Attendance Alert (&lt;75%)</span>
              </div>
              <div className="space-y-2">
                {dashboardData.studentStats
                  .filter((st) => st.percentage < 75)
                  .map((st) => {
                    const lowAttMsg = `Dear ${st.student.parentName || "Parent"}, ${st.student.name}'s attendance at ${institute} has dropped to ${st.percentage}%. Please ensure regular attendance.`;
                    return (
                      <div key={st.student.id} className="flex items-center justify-between text-xs bg-white/80 p-2.5 rounded-lg border border-rose-100">
                        <div>
                          <p className="font-semibold text-gray-900">{st.student.name}</p>
                          <p className="text-[11px] text-rose-700">Parent: {st.student.parentName} ({st.student.parentPhone})</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-rose-600 text-sm">{st.percentage}%</span>
                          <a
                            href={getWhatsAppLink(st.student.parentPhone, lowAttMsg)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                            title="Send WhatsApp Low Attendance Warning"
                          >
                            <MessageSquare className="size-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Attendance Trend Chart */}
          <Card className="p-4">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <UserCheck className="size-4 text-emerald-600" />
              Daily Attendance Trend (%)
            </h3>
            {dashboardData.dateStats.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted">No attendance history logged yet.</p>
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardData.dateStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="attColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#attColor)" name="Present %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Student-wise Attendance Breakdown */}
          <Card className="p-4">
            <h3 className="text-sm font-bold mb-3">Student Attendance Breakdown</h3>
            {dashboardData.studentStats.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted">No students found.</p>
            ) : (
              <div className="space-y-3">
                {dashboardData.studentStats.map((st) => (
                  <div key={st.student.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{st.student.name}</span>
                      <span className={st.percentage < 75 ? "text-rose-600 font-bold" : "text-emerald-600"}>
                        {st.present}/{st.total} ({st.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          st.percentage >= 85 ? "bg-emerald-500" : st.percentage >= 75 ? "bg-amber-500" : "bg-rose-500",
                        )}
                        style={{ width: `${st.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

class DateSet {
  private items: Set<string>;
  constructor(arr: string[]) {
    this.items = new Set(arr);
  }
  [Symbol.iterator]() {
    return this.items.values();
  }
}
