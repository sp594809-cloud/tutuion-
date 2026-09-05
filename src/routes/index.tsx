import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardCheck, Plus, Users, Wallet } from "lucide-react";
import { Card } from "@/components/ui";
import { useTuition } from "@/lib/store";
import { inr, prettyDate, todayISO } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const students = useTuition((s) => s.students);
  const payments = useTuition((s) => s.payments);
  const today = todayISO();
  const todayTotal = payments.filter((p) => p.date === today).reduce((a, p) => a + p.amount, 0);
  const pending = students.reduce((a, s) => a + s.dueAmount, 0);
  const dueCount = students.filter((s) => s.dueAmount > 0).length;
  const recent = payments.slice(0, 4);

  return (
    <div className="space-y-4 px-4 pt-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted">Today collection</p>
          <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight">{inr(todayTotal)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted">Pending fees</p>
          <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-danger">{inr(pending)}</p>
          <p className="mt-1 text-xs text-muted">{dueCount} students</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/attendance"
          className="flex min-h-20 flex-col justify-between rounded-xl bg-primary p-4 text-primary-fg"
        >
          <ClipboardCheck className="size-5" />
          <span className="text-sm font-semibold">Mark attendance</span>
        </Link>
        <Link
          to="/fees"
          className="flex min-h-20 flex-col justify-between rounded-xl bg-surface p-4 ring-1 ring-border"
        >
          <Wallet className="size-5 text-primary" />
          <span className="text-sm font-semibold">Collect fee</span>
        </Link>
        <Link
          to="/students"
          search={{ add: true }}
          className="flex min-h-20 flex-col justify-between rounded-xl bg-surface p-4 ring-1 ring-border"
        >
          <Plus className="size-5 text-primary" />
          <span className="text-sm font-semibold">Add student</span>
        </Link>
        <Link
          to="/students"
          className="flex min-h-20 flex-col justify-between rounded-xl bg-surface p-4 ring-1 ring-border"
        >
          <Users className="size-5 text-primary" />
          <span className="text-sm font-semibold">{students.length} students</span>
        </Link>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-muted">Recent payments</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted">No payments yet.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((p) => {
              const st = students.find((s) => s.id === p.studentId);
              return (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg bg-surface px-3 py-3 ring-1 ring-border"
                >
                  <div>
                    <p className="text-sm font-medium">{st?.name ?? "Student"}</p>
                    <p className="text-xs text-muted">
                      {prettyDate(p.date)} · {p.mode.toUpperCase()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">{inr(p.amount)}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
