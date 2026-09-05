import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MessageSquare, Phone, UserCheck, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Field, Input, Select } from "@/components/ui";
import { useTuition } from "@/lib/store";
import { generateFeeDueWhatsApp, generateFeeReceiptWhatsApp, getWhatsAppLink, inr, prettyDate, todayISO } from "@/lib/utils";
import type { PayMode } from "@/lib/types";

export const Route = createFileRoute("/students/$studentId")({
  component: StudentDetail,
});

function StudentDetail() {
  const { studentId } = Route.useParams();
  const navigate = useNavigate();
  const student = useTuition((s) => s.students.find((x) => x.id === studentId));
  const batches = useTuition((s) => s.batches);
  const payments = useTuition((s) => s.payments.filter((p) => p.studentId === studentId));
  const attendance = useTuition((s) => s.attendance.filter((a) => a.studentId === studentId));
  const tests = useTuition((s) => s.tests);
  const marks = useTuition((s) => s.marks.filter((m) => m.studentId === studentId));
  const collectFee = useTuition((s) => s.collectFee);
  const updateStudent = useTuition((s) => s.updateStudent);
  const deleteStudent = useTuition((s) => s.deleteStudent);
  const institute = useTuition((s) => s.institute);
  const teachers = useTuition((s) => s.teachers);
  const activeTeacherId = useTuition((s) => s.activeTeacherId);

  const activeTeacher = teachers.find((t) => t.id === activeTeacherId) || teachers[0];
  const teacherPhone = activeTeacher?.phone;

  const [amount, setAmount] = useState(student ? String(student.dueAmount || student.monthlyFee) : "");
  const [mode, setMode] = useState<PayMode>("cash");
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(student?.name ?? "");
  const [parentName, setParentName] = useState(student?.parentName ?? "");
  const [parentPhone, setParentPhone] = useState(student?.parentPhone ?? "");
  const [studentPhone, setStudentPhone] = useState(student?.studentPhone ?? "");
  const [batchId, setBatchId] = useState(student?.batchId ?? "");

  const monthAtt = useMemo(() => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return attendance.filter((a) => a.date.startsWith(prefix));
  }, [attendance]);
  const present = monthAtt.filter((a) => a.status === "present").length;

  if (!student) {
    return <p className="px-4 pt-8 text-sm text-muted">Student not found.</p>;
  }

  const batch = batches.find((b) => b.id === student.batchId);

  const dueMsg = generateFeeDueWhatsApp({
    studentName: student.name,
    parentName: student.parentName,
    dueAmount: student.dueAmount,
    batchName: batch?.name,
    instituteName: activeTeacher?.instituteName || institute,
    teacherPhone,
  });

  return (
    <div className="space-y-4 px-4 pt-4 pb-12">
      <div>
        {editing ? (
          <form
            className="space-y-3 rounded-xl bg-surface p-4 ring-1 ring-border shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              updateStudent(student.id, {
                name: name.trim(),
                parentName: parentName.trim(),
                parentPhone: parentPhone.trim(),
                studentPhone: studentPhone.trim() || undefined,
                batchId,
              });
              setEditing(false);
            }}
          >
            <Field label="Student Name">
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Parent Name">
              <Input value={parentName} onChange={(e) => setParentName(e.target.value)} />
            </Field>
            <Field label="Parent Phone (WhatsApp)">
              <Input value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
            </Field>
            <Field label="Student Phone (Optional WhatsApp)">
              <Input
                placeholder="Optional"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
              />
            </Field>
            <Field label="Batch">
              <Select value={batchId} onChange={(e) => setBatchId(e.target.value)}>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 font-bold">
                Save Changes
              </Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-surface ring-1 ring-border shadow-sm space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight">{student.name}</h1>
                <p className="text-xs font-semibold text-primary">{batch?.name ?? "No batch"}</p>
              </div>
              <Button variant="secondary" className="min-h-8 text-xs px-3" onClick={() => setEditing(true)}>
                Edit Details
              </Button>
            </div>

            <div className="text-xs text-muted space-y-1 pt-1 border-t border-border/50">
              <p><span className="font-semibold text-gray-800">Parent:</span> {student.parentName || "N/A"} ({student.parentPhone})</p>
              {student.studentPhone && (
                <p><span className="font-semibold text-gray-800">Student Phone:</span> {student.studentPhone}</p>
              )}
            </div>

            {/* Quick WhatsApp Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={getWhatsAppLink(student.parentPhone, dueMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              >
                <MessageSquare className="size-3.5" />
                <span>WhatsApp Parent</span>
              </a>

              {student.studentPhone && (
                <a
                  href={getWhatsAppLink(student.studentPhone, `Hello ${student.name}, notice from ${activeTeacher?.instituteName || institute}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                >
                  <MessageSquare className="size-3.5" />
                  <span>WhatsApp Student</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface p-4 ring-1 ring-border shadow-sm">
          <p className="text-xs text-muted font-medium">Pending Dues</p>
          <p className={student.dueAmount > 0 ? "text-lg font-black text-rose-600" : "text-lg font-bold text-emerald-600"}>
            {student.dueAmount > 0 ? inr(student.dueAmount) : "Paid ✓"}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4 ring-1 ring-border shadow-sm">
          <p className="text-xs text-muted font-medium">Monthly Attendance</p>
          <p className="text-lg font-black tracking-tight">
            {present}/{monthAtt.length || 0} present
          </p>
        </div>
      </div>

      {student.dueAmount > 0 && (
        <form
          className="space-y-3 rounded-xl bg-surface p-4 ring-1 ring-border shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            collectFee(student.id, Number(amount) || 0, mode);
          }}
        >
          <p className="text-sm font-bold text-gray-900">Collect Fee Payment</p>
          <Field label="Amount (₹)">
            <Input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Field label="Payment Mode">
            <Select value={mode} onChange={(e) => setMode(e.target.value as PayMode)}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank</option>
            </Select>
          </Field>
          <Button type="submit" className="w-full font-bold h-11">
            Save Payment & Receipt
          </Button>
        </form>
      )}

      <section>
        <h2 className="mb-2 text-xs font-bold text-muted uppercase tracking-wider">Payment History</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-muted">No payments recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {payments.map((p) => {
              const receiptMsg = generateFeeReceiptWhatsApp({
                studentName: student.name,
                parentName: student.parentName,
                amountPaid: p.amount,
                mode: p.mode,
                paymentDate: p.date,
                remainingDue: student.dueAmount,
                instituteName: activeTeacher?.instituteName || institute,
                teacherPhone,
              });

              return (
                <li key={p.id} className="flex items-center justify-between text-sm p-3 rounded-xl bg-surface border border-border">
                  <div>
                    <span className="font-semibold block">{prettyDate(p.date)} · {p.mode.toUpperCase()}</span>
                    <a
                      href={getWhatsAppLink(student.parentPhone, receiptMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-emerald-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <MessageSquare className="size-3" />
                      Send Receipt PDF/WhatsApp
                    </a>
                  </div>
                  <span className="font-black text-emerald-600 tabular-nums">{inr(p.amount)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-xs font-bold text-muted uppercase tracking-wider">Exam Marks History</h2>
        {marks.length === 0 ? (
          <p className="text-sm text-muted">No test marks recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {marks.map((m) => {
              const t = tests.find((x) => x.id === m.testId);
              return (
                <li key={m.id} className="flex justify-between items-center text-sm p-3 rounded-xl bg-surface border border-border">
                  <span className="font-medium">{t?.name ?? "Test"}</span>
                  <span className="font-bold tabular-nums text-indigo-600">
                    {m.score} / {t?.maxMarks ?? "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="pt-2">
        <Button
          variant="danger"
          className="w-full font-bold h-11"
          onClick={() => {
            if (window.confirm(`Remove ${student.name} permanently?`)) {
              deleteStudent(student.id);
              void navigate({ to: "/students" });
            }
          }}
        >
          Delete Student Record
        </Button>
      </div>
    </div>
  );
}
