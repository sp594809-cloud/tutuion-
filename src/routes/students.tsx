import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Edit3, MessageSquare, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Sheet } from "@/components/sheet";
import { Button, Field, Input, Select } from "@/components/ui";
import { useTuition } from "@/lib/store";
import { generateFeeDueWhatsApp, getWhatsAppLink, inr, todayISO } from "@/lib/utils";
import type { Student } from "@/lib/types";

type Search = { add?: boolean };

export const Route = createFileRoute("/students")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    add: s.add === true || s.add === "true",
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const { add } = Route.useSearch();
  const navigate = useNavigate();
  const students = useTuition((s) => s.students);
  const batches = useTuition((s) => s.batches);
  const addStudent = useTuition((s) => s.addStudent);
  const updateStudent = useTuition((s) => s.updateStudent);
  const deleteStudent = useTuition((s) => s.deleteStudent);
  const institute = useTuition((s) => s.institute);
  const teachers = useTuition((s) => s.teachers);
  const activeTeacherId = useTuition((s) => s.activeTeacherId);

  const activeTeacher = teachers.find((t) => t.id === activeTeacherId) || teachers[0];
  const teacherPhone = activeTeacher?.phone;

  const [q, setQ] = useState("");
  const [filterBatch, setFilterBatch] = useState("all");
  const [page, setPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const pageSize = 20;

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return students
      .filter((s) => {
        const matchesQuery =
          !t ||
          s.name.toLowerCase().includes(t) ||
          s.parentPhone.includes(t) ||
          (s.studentPhone && s.studentPhone.includes(t));
        const matchesBatch = filterBatch === "all" || s.batchId === filterBatch;
        return matchesQuery && matchesBatch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, q, filterBatch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  function closeSheet() {
    void navigate({ to: "/students", search: {} });
  }

  function handleDelete(student: Student) {
    if (window.confirm(`Are you sure you want to delete ${student.name}? This will remove all their attendance and test records.`)) {
      deleteStudent(student.id);
    }
  }

  return (
    <div className="px-4 pt-4 space-y-3 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Students ({students.length})</h1>
        <Button
          className="min-h-10 font-bold"
          onClick={() => void navigate({ to: "/students", search: { add: true } })}
        >
          <Plus className="size-4" />
          Add Student
        </Button>
      </div>

      {/* Search & Batch Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input
          placeholder="Search student, parent phone or student phone..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
        <Select
          value={filterBatch}
          onChange={(e) => {
            setFilterBatch(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Batches ({students.length} students)</option>
          {batches.map((b) => {
            const count = students.filter((s) => s.batchId === b.id).length;
            return (
              <option key={b.id} value={b.id}>
                {b.name} ({count})
              </option>
            );
          })}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">No matching students found.</p>
      ) : (
        <div className="space-y-3">
          <ul className="space-y-2">
            {paginated.map((s) => {
              const batch = batches.find((b) => b.id === s.batchId);
              const dueMsg = generateFeeDueWhatsApp({
                studentName: s.name,
                parentName: s.parentName,
                dueAmount: s.dueAmount,
                batchName: batch?.name,
                instituteName: activeTeacher?.instituteName || institute,
                teacherPhone,
              });

              return (
                <li
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl bg-surface p-3.5 ring-1 ring-border shadow-sm hover:ring-primary/50 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to="/students/$studentId"
                        params={{ studentId: s.id }}
                        className="font-bold text-sm text-gray-900 hover:text-primary transition-colors truncate"
                      >
                        {s.name}
                      </Link>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                        {batch?.name ?? "No batch"}
                      </span>
                    </div>

                    <p className="text-xs text-muted mt-0.5">
                      Parent: {s.parentName || "N/A"} ({s.parentPhone})
                      {s.studentPhone ? ` · Student: ${s.studentPhone}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    <p
                      className={
                        s.dueAmount > 0
                          ? "text-xs font-bold tabular-nums text-danger mr-1"
                          : "text-xs font-semibold tabular-nums text-emerald-600 mr-1"
                      }
                    >
                      {s.dueAmount > 0 ? `${inr(s.dueAmount)} due` : "Paid ✓"}
                    </p>

                    {/* WhatsApp Action */}
                    {s.dueAmount > 0 && (
                      <a
                        href={getWhatsAppLink(s.parentPhone, dueMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        title="Send WhatsApp Fee Reminder"
                      >
                        <MessageSquare className="size-3.5" />
                      </a>
                    )}

                    {/* Quick Edit Student Button */}
                    <button
                      type="button"
                      onClick={() => setEditingStudent(s)}
                      className="p-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                      title="Edit Student Details"
                    >
                      <Edit3 className="size-3.5" />
                    </button>

                    {/* Quick Delete Student Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                      title="Delete Student"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-xs font-semibold">
              <span className="text-muted">
                Showing { (page - 1) * pageSize + 1 } - { Math.min(page * pageSize, filtered.length) } of { filtered.length }
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="min-h-8 px-3 text-xs"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  className="min-h-8 px-3 text-xs"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add New Student Sheet */}
      <Sheet title="Add New Student" open={!!add} onClose={closeSheet}>
        <StudentForm
          onSave={(data) => {
            addStudent({ ...data, joinedAt: todayISO() });
            closeSheet();
          }}
        />
      </Sheet>

      {/* Edit Student Sheet Modal */}
      <Sheet title={`Edit Details: ${editingStudent?.name ?? ""}`} open={!!editingStudent} onClose={() => setEditingStudent(null)}>
        {editingStudent && (
          <StudentForm
            initial={editingStudent}
            onSave={(data) => {
              updateStudent(editingStudent.id, data);
              setEditingStudent(null);
            }}
            onDelete={() => {
              handleDelete(editingStudent);
              setEditingStudent(null);
            }}
          />
        )}
      </Sheet>
    </div>
  );
}

function StudentForm({
  initial,
  onSave,
  onDelete,
}: {
  initial?: Student;
  onSave: (data: {
    name: string;
    parentName: string;
    parentPhone: string;
    studentPhone?: string;
    batchId: string;
    monthlyFee: number;
    dueAmount: number;
  }) => void;
  onDelete?: () => void;
}) {
  const batches = useTuition((s) => s.batches);
  const [name, setName] = useState(initial?.name ?? "");
  const [parentName, setParentName] = useState(initial?.parentName ?? "");
  const [parentPhone, setParentPhone] = useState(initial?.parentPhone ?? "");
  const [studentPhone, setStudentPhone] = useState(initial?.studentPhone ?? "");
  const [batchId, setBatchId] = useState(initial?.batchId ?? batches[0]?.id ?? "");
  const batch = batches.find((b) => b.id === batchId);
  const [fee, setFee] = useState(String(initial?.monthlyFee ?? batch?.monthlyFee ?? 0));
  const [due, setDue] = useState(String(initial?.dueAmount ?? batch?.monthlyFee ?? 0));

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const monthlyFee = Number(fee) || 0;
        const dueAmount = Number(due) || 0;
        onSave({
          name: name.trim(),
          parentName: parentName.trim(),
          parentPhone: parentPhone.trim(),
          studentPhone: studentPhone.trim() || undefined,
          batchId,
          monthlyFee,
          dueAmount,
        });
      }}
    >
      <Field label="Student Name">
        <Input required placeholder="e.g. Rahul Sharma" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Parent / Guardian Name">
        <Input required placeholder="e.g. Suresh Sharma" value={parentName} onChange={(e) => setParentName(e.target.value)} />
      </Field>
      <Field label="Parent Phone (WhatsApp)">
        <Input
          required
          placeholder="e.g. 9876543210"
          inputMode="numeric"
          value={parentPhone}
          onChange={(e) => setParentPhone(e.target.value)}
        />
      </Field>
      <Field label="Student Phone (Optional WhatsApp)">
        <Input
          placeholder="e.g. 9876599901 (Optional)"
          inputMode="numeric"
          value={studentPhone}
          onChange={(e) => setStudentPhone(e.target.value)}
        />
      </Field>
      <Field label="Batch">
        <Select
          value={batchId}
          onChange={(e) => {
            setBatchId(e.target.value);
            const b = batches.find((x) => x.id === e.target.value);
            if (b && !initial) {
              setFee(String(b.monthlyFee));
              setDue(String(b.monthlyFee));
            }
          }}
        >
          {batches.length === 0 && <option value="">Add a batch first</option>}
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Monthly Fee (₹)">
          <Input inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value)} />
        </Field>
        <Field label="Pending Due (₹)">
          <Input inputMode="numeric" value={due} onChange={(e) => setDue(e.target.value)} />
        </Field>
      </div>

      <div className="pt-2 space-y-2">
        <Button className="w-full h-11 font-bold shadow-md" type="submit" disabled={!name.trim() || !parentPhone.trim() || !batchId}>
          {initial ? "Save Student Changes" : "Save New Student"}
        </Button>

        {initial && onDelete && (
          <Button type="button" variant="danger" className="w-full h-10 font-bold" onClick={onDelete}>
            Delete Student Record
          </Button>
        )}
      </div>
    </form>
  );
}
