import { createFileRoute } from "@tanstack/react-router";
import { Award, BarChart3, TrendingUp, Users, Wallet } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui";
import { useTuition } from "@/lib/store";
import { inr, todayISO } from "@/lib/utils";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

function ReportsPage() {
  const students = useTuition((s) => s.students);
  const payments = useTuition((s) => s.payments);
  const attendance = useTuition((s) => s.attendance);
  const batches = useTuition((s) => s.batches);
  const tests = useTuition((s) => s.tests);
  const marks = useTuition((s) => s.marks);

  const today = todayISO();
  const month = today.slice(0, 7);

  // Memoized High-Speed Aggregations
  const reportStats = useMemo(() => {
    const monthPay = payments.filter((p) => p.date.startsWith(month)).reduce((a, p) => a + p.amount, 0);
    const pending = students.reduce((a, s) => a + s.dueAmount, 0);
    const monthAtt = attendance.filter((a) => a.date.startsWith(month));
    const present = monthAtt.filter((a) => a.status === "present").length;
    const attPct = monthAtt.length ? Math.round((present / monthAtt.length) * 100) : 0;

    // Batch-wise Fee Breakdown
    const batchFeeData = batches.map((b) => {
      const bStudents = students.filter((s) => s.batchId === b.id);
      const bPending = bStudents.reduce((acc, s) => acc + s.dueAmount, 0);
      const bCollected = payments
        .filter((p) => bStudents.some((s) => s.id === p.studentId) && p.date.startsWith(month))
        .reduce((acc, p) => acc + p.amount, 0);

      return {
        batchName: b.name.split(" ")[0] + " " + (b.subject || ""),
        Collected: bCollected,
        Pending: bPending,
      };
    });

    // Batch-wise Attendance Breakdown
    const batchAttData = batches.map((b) => {
      const bAtt = attendance.filter((a) => a.batchId === b.id && a.date.startsWith(month));
      const bPresent = bAtt.filter((a) => a.status === "present").length;
      const bPct = bAtt.length > 0 ? Math.round((bPresent / bAtt.length) * 100) : 0;
      return {
        batchName: b.name.split(" ")[0] + " " + (b.subject || ""),
        attendancePct: bPct,
      };
    });

    return {
      monthPay,
      pending,
      attPct,
      monthAttCount: monthAtt.length,
      presentCount: present,
      batchFeeData,
      batchAttData,
    };
  }, [students, payments, attendance, batches, month]);

  return (
    <div className="space-y-4 px-4 pt-4 pb-12">
      <h1 className="text-xl font-bold tracking-tight">Institute Reports & Analytics</h1>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="p-3.5">
          <p className="text-xs text-muted font-medium flex items-center gap-1">
            <Wallet className="size-3.5 text-emerald-600" />
            This Month Collection
          </p>
          <p className="mt-1 text-2xl font-black tabular-nums tracking-tight text-emerald-600">{inr(reportStats.monthPay)}</p>
        </Card>

        <Card className="p-3.5">
          <p className="text-xs text-muted font-medium flex items-center gap-1">
            <TrendingUp className="size-3.5 text-rose-500" />
            Total Pending Fees
          </p>
          <p className="mt-1 text-2xl font-black tabular-nums tracking-tight text-rose-500">{inr(reportStats.pending)}</p>
        </Card>

        <Card className="p-3.5 col-span-2 sm:col-span-1">
          <p className="text-xs text-muted font-medium flex items-center gap-1">
            <Users className="size-3.5 text-indigo-600" />
            Avg Monthly Attendance
          </p>
          <p className="mt-1 text-2xl font-black tabular-nums tracking-tight text-indigo-600">{reportStats.attPct}%</p>
          <p className="text-[11px] text-muted">{reportStats.presentCount} present of {reportStats.monthAttCount} records</p>
        </Card>
      </div>

      {/* Fee Collection Breakdown Chart */}
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <BarChart3 className="size-4 text-emerald-600" />
          Batch-wise Fee Collection vs Pending (₹)
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportStats.batchFeeData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="batchName" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pending" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Attendance % by Batch Chart */}
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Award className="size-4 text-indigo-600" />
          Batch Attendance Comparison (%)
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportStats.batchAttData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="batchName" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="attendancePct" fill="#6366f1" radius={[4, 4, 0, 0]} name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
