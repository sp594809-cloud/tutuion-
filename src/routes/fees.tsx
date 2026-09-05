import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Receipt, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { Sheet } from "@/components/sheet";
import { Button, Field, Input, Select } from "@/components/ui";
import { useTuition } from "@/lib/store";
import { cn, generateFeeDueWhatsApp, generateFeeReceiptWhatsApp, getWhatsAppLink, inr, prettyDate, todayISO } from "@/lib/utils";
import type { PayMode, Student } from "@/lib/types";

export const Route = createFileRoute("/fees")({ component: FeesPage });

function FeesPage() {
  const students = useTuition((s) => s.students);
  const payments = useTuition((s) => s.payments);
  const batches = useTuition((s) => s.batches);
  const collectFee = useTuition((s) => s.collectFee);
  const chargeMonth = useTuition((s) => s.chargeMonth);
  const institute = useTuition((s) => s.institute);
  const teachers = useTuition((s) => s.teachers);
  const activeTeacherId = useTuition((s) => s.activeTeacherId);

  const activeTeacher = teachers.find((t) => t.id === activeTeacherId) || teachers[0];
  const teacherPhone = activeTeacher?.phone;

  const [tab, setTab] = useState<"due" | "collected">("due");
  const [pick, setPick] = useState<Student | null>(null);

  const due = useMemo(
    () => students.filter((s) => s.dueAmount > 0).sort((a, b) => b.dueAmount - a.dueAmount),
    [students],
  );
  const today = todayISO();
  const collected = payments.filter((p) => p.date === today);
  const todayTotal = collected.reduce((a, p) => a + p.amount, 0);

  return (
    <div className="px-4 pt-4 space-y-4 pb-12">
      <h1 className="text-xl font-bold tracking-tight">Fee Management & Receipts</h1>
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-surface p-1 ring-1 ring-border">
        <button
          type="button"
          className={cn(
            "h-10 rounded-md text-sm font-semibold transition-colors",
            tab === "due" ? "bg-primary text-primary-fg shadow" : "text-muted hover:text-fg",
          )}
          onClick={() => setTab("due")}
        >
          Pending Dues ({due.length})
        </button>
        <button
          type="button"
          className={cn(
            "h-10 rounded-md text-sm font-semibold transition-colors",
            tab === "collected" ? "bg-primary text-primary-fg shadow" : "text-muted hover:text-fg",
          )}
          onClick={() => setTab("collected")}
        >
          Today Collected ({collected.length})
        </button>
      </div>

      {tab === "due" ? (
        <>
          <Button
            variant="secondary"
            className="w-full font-bold h-11"
            onClick={() => {
              if (window.confirm("Add this month’s fee to every student due?")) chargeMonth();
            }}
          >
            + Charge Monthly Fee to All Students
          </Button>

          {due.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No pending fees.</p>
          ) : (
            <ul className="space-y-2">
              {due.map((s) => {
                const batchObj = batches.find((b) => b.id === s.batchId);
                const dueMsg = generateFeeDueWhatsApp({
                  studentName: s.name,
                  parentName: s.parentName,
                  dueAmount: s.dueAmount,
                  batchName: batchObj?.name,
                  instituteName: activeTeacher?.instituteName || institute,
                  teacherPhone,
                });

                return (
                  <li
                    key={s.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl bg-surface p-3.5 ring-1 ring-border shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-sm">{s.name}</p>
                      <p className="text-xs text-muted">
                        {batchObj?.name ?? "No batch"} · Parent: {s.parentPhone}
                      </p>
                      <p className="text-sm font-bold tabular-nums text-rose-600 mt-0.5">{inr(s.dueAmount)} pending</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 sm:pt-0">
                      <a
                        href={getWhatsAppLink(s.parentPhone, dueMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all"
                      >
                        <MessageSquare className="size-3.5" />
                        <span>Send Due Reminder</span>
                      </a>
                      <Button onClick={() => setPick(s)} className="min-h-9 font-bold text-xs">
                        Collect
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      ) : (
        <>
          <p className="text-sm text-muted">
            Today's Total Collection: <span className="font-extrabold text-emerald-600 text-base tabular-nums">{inr(todayTotal)}</span>
          </p>
          {collected.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No collection today.</p>
          ) : (
            <ul className="space-y-2">
              {collected.map((p) => {
                const st = students.find((s) => s.id === p.studentId);
                const receiptMsg = generateFeeReceiptWhatsApp({
                  studentName: st?.name || "Student",
                  parentName: st?.parentName,
                  amountPaid: p.amount,
                  mode: p.mode,
                  paymentDate: p.date,
                  remainingDue: st?.dueAmount || 0,
                  instituteName: activeTeacher?.instituteName || institute,
                  teacherPhone,
                });

                return (
                  <li
                    key={p.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-surface p-3.5 ring-1 ring-border shadow-sm"
                  >
                    <div>
                      <span className="font-semibold text-sm block">{st?.name}</span>
                      <span className="text-xs text-muted">
                        {prettyDate(p.date)} · {p.mode.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="font-black text-sm text-emerald-600 tabular-nums">{inr(p.amount)}</span>
                      {st && (
                        <a
                          href={getWhatsAppLink(st.parentPhone, receiptMsg)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                        >
                          <Receipt className="size-3.5" />
                          <span>WhatsApp Receipt</span>
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      <Sheet title="Collect Fee" open={!!pick} onClose={() => setPick(null)}>
        {pick && (
          <CollectForm
            student={pick}
            instituteName={activeTeacher?.instituteName || institute}
            teacherPhone={teacherPhone}
            onSave={(amount, mode) => {
              collectFee(pick.id, amount, mode);
              setPick(null);
            }}
          />
        )}
      </Sheet>
    </div>
  );
}

function CollectForm({
  student,
  instituteName,
  teacherPhone,
  onSave,
}: {
  student: Student;
  instituteName: string;
  teacherPhone?: string;
  onSave: (amount: number, mode: PayMode) => void;
}) {
  const [amount, setAmount] = useState(String(student.dueAmount));
  const [mode, setMode] = useState<PayMode>("cash");

  const receiptMsg = generateFeeReceiptWhatsApp({
    studentName: student.name,
    parentName: student.parentName,
    amountPaid: Number(amount) || 0,
    mode,
    paymentDate: todayISO(),
    remainingDue: Math.max(0, student.dueAmount - (Number(amount) || 0)),
    instituteName,
    teacherPhone,
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(Number(amount) || 0, mode);
      }}
    >
      <p className="text-sm font-semibold">
        {student.name} · Pending Due: <span className="font-extrabold text-rose-600 tabular-nums">{inr(student.dueAmount)}</span>
      </p>

      <Field label="Collection Amount (₹)">
        <Input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>

      <Field label="Payment Mode">
        <Select value={mode} onChange={(e) => setMode(e.target.value as PayMode)}>
          <option value="cash">Cash</option>
          <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
          <option value="bank">Bank Transfer</option>
        </Select>
      </Field>

      <div className="pt-2 space-y-2">
        <Button className="w-full h-11 font-bold shadow-lg" type="submit">
          Save Payment Record
        </Button>
        <a
          href={getWhatsAppLink(student.parentPhone, receiptMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow transition-all"
        >
          <MessageSquare className="size-4" />
          <span>Save & Send WhatsApp Receipt to Parent</span>
        </a>
      </div>
    </form>
  );
}
