import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Edit3, LogOut, Plus, ShieldCheck, UserCheck, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { Sheet } from "@/components/sheet";
import { Button, Card, Field, Input, Select } from "@/components/ui";
import { useTuition } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { TeacherProfile } from "@/lib/types";

export const Route = createFileRoute("/faculty")({ component: FacultyPage });

const AVAILABLE_SUBJECTS = ["Maths", "Science", "English", "Physics", "Chemistry", "Biology", "Social Studies", "Hindi", "Gujarati", "Accountancy", "Economics"];
const FACULTY_ROLES = ["Institute Owner", "Senior Faculty", "Subject Teacher", "Guest Lecturer", "Admin"];

function FacultyPage() {
  const navigate = useNavigate();
  const teachers = useTuition((s) => s.teachers);
  const activeTeacherId = useTuition((s) => s.activeTeacherId);
  const setActiveTeacher = useTuition((s) => s.setActiveTeacher);
  const addTeacher = useTuition((s) => s.addTeacher);
  const updateTeacher = useTuition((s) => s.updateTeacher);
  const deleteTeacher = useTuition((s) => s.deleteTeacher);
  const institute = useTuition((s) => s.institute);
  const setInstitute = useTuition((s) => s.setInstitute);

  const [openAdd, setOpenAdd] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherProfile | null>(null);

  const activeTeacher = teachers.find((t) => t.id === activeTeacherId) || teachers[0];

  return (
    <div className="px-4 pt-4 space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Faculty & Login Center</h1>
          <p className="text-xs text-muted">Manage tuition teachers, subjects, and WhatsApp credentials</p>
        </div>
        <Button onClick={() => setOpenAdd(true)} className="font-bold text-xs">
          <UserPlus className="size-4" />
          Add Faculty
        </Button>
      </div>

      {/* Active Logged-In Teacher Card */}
      {activeTeacher ? (
        <Card className="p-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl border border-indigo-700">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-white/10 px-2 py-0.5 rounded">
                Active Faculty Logged In
              </span>
              <h2 className="text-xl font-black mt-1">{activeTeacher.name}</h2>
              <p className="text-xs text-indigo-200">{activeTeacher.role || "Faculty"} · {activeTeacher.instituteName || institute}</p>
            </div>
            <Button
              variant="secondary"
              className="min-h-8 text-xs font-bold bg-white text-gray-900 hover:bg-gray-100"
              onClick={() => setEditingTeacher(activeTeacher)}
            >
              <Edit3 className="size-3.5" />
              Edit Profile
            </Button>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-[10px] text-indigo-300 font-medium">Email Address</p>
              <p className="font-semibold truncate">{activeTeacher.email || "Not set"}</p>
            </div>
            <div>
              <p className="text-[10px] text-indigo-300 font-medium">WhatsApp Mobile</p>
              <p className="font-semibold">{activeTeacher.phone || "Not set"}</p>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-white/10">
            <p className="text-[10px] text-indigo-300 font-medium mb-1">Subjects Taught:</p>
            <div className="flex flex-wrap gap-1">
              {(activeTeacher.subjects || []).map((sub) => (
                <span key={sub} className="px-2 py-0.5 bg-indigo-500/30 text-indigo-100 rounded text-[11px] font-bold border border-indigo-400/30">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 text-center space-y-3">
          <p className="text-sm font-semibold text-muted">No active teacher profile found.</p>
          <Button onClick={() => setOpenAdd(true)} className="w-full font-bold">
            Create First Faculty Profile
          </Button>
        </Card>
      )}

      {/* Switch Between Faculty Profiles */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Users className="size-4 text-primary" />
          Switch Faculty Login ({teachers.length} registered)
        </h3>

        <div className="space-y-2">
          {teachers.map((t) => {
            const isActive = t.id === activeTeacherId;
            return (
              <div
                key={t.id}
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-xl border transition-all",
                  isActive
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-surface border-border hover:border-border/80",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-gray-900">{t.name}</p>
                    {isActive && (
                      <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        ACTIVE LOGGED IN
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {t.phone} · {t.email}
                  </p>
                  <p className="text-[11px] font-medium text-primary mt-0.5">
                    Subjects: {(t.subjects || []).join(", ") || "General"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {!isActive && (
                    <Button
                      variant="secondary"
                      className="min-h-8 text-xs font-bold"
                      onClick={() => setActiveTeacher(t.id)}
                    >
                      Login as {t.name.split(" ")[0]}
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={() => setEditingTeacher(t)}
                    className="p-2 text-muted hover:text-fg rounded-lg"
                    title="Edit Faculty Profile"
                  >
                    <Edit3 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sheets for Adding / Editing Teachers */}
      <Sheet title="Register New Faculty" open={openAdd} onClose={() => setOpenAdd(false)}>
        <TeacherForm
          defaultInstitute={institute}
          onSave={(data) => {
            const id = addTeacher(data);
            setActiveTeacher(id);
            setOpenAdd(false);
          }}
        />
      </Sheet>

      <Sheet title="Edit Faculty Profile" open={!!editingTeacher} onClose={() => setEditingTeacher(null)}>
        {editingTeacher && (
          <TeacherForm
            initial={editingTeacher}
            defaultInstitute={institute}
            onSave={(data) => {
              updateTeacher(editingTeacher.id, data);
              if (data.instituteName) setInstitute(data.instituteName);
              setEditingTeacher(null);
            }}
            onDelete={() => {
              if (window.confirm(`Delete ${editingTeacher.name} profile?`)) {
                deleteTeacher(editingTeacher.id);
                setEditingTeacher(null);
              }
            }}
          />
        )}
      </Sheet>
    </div>
  );
}

function TeacherForm({
  initial,
  defaultInstitute,
  onSave,
  onDelete,
}: {
  initial?: TeacherProfile;
  defaultInstitute: string;
  onSave: (data: Omit<TeacherProfile, "id">) => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [instituteName, setInstituteName] = useState(initial?.instituteName ?? defaultInstitute);
  const [role, setRole] = useState(initial?.role ?? FACULTY_ROLES[0]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(initial?.subjects ?? ["Maths"]);

  function toggleSubject(sub: string) {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          instituteName: instituteName.trim() || defaultInstitute,
          role,
          subjects: selectedSubjects,
        });
      }}
    >
      <Field label="Faculty / Teacher Full Name">
        <Input required placeholder="e.g. Suhag Patel" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>

      <Field label="Email Address">
        <Input required type="email" placeholder="e.g. suhag.patel@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>

      <Field label="WhatsApp Mobile Number">
        <Input required inputMode="numeric" placeholder="e.g. 9737948529" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Field>

      <Field label="Tuition / Academy Name">
        <Input required placeholder="e.g. Sunrise Tuition Academy" value={instituteName} onChange={(e) => setInstituteName(e.target.value)} />
      </Field>

      <Field label="Designation / Role">
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          {FACULTY_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </Field>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">Subjects Taught (Select Multiple):</label>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {AVAILABLE_SUBJECTS.map((sub) => {
            const isSel = selectedSubjects.includes(sub);
            return (
              <button
                key={sub}
                type="button"
                onClick={() => toggleSubject(sub)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold transition-all border",
                  isSel
                    ? "bg-primary text-primary-fg border-primary shadow"
                    : "bg-surface text-muted border-border hover:bg-bg",
                )}
              >
                {isSel ? "✓ " : "+ "}
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2 space-y-2">
        <Button className="w-full h-11 font-bold shadow-lg" type="submit" disabled={!name.trim() || !email.trim() || !phone.trim()}>
          {initial ? "Save Faculty Profile Changes" : "Register & Login Faculty"}
        </Button>

        {initial && onDelete && (
          <Button type="button" variant="danger" className="w-full h-10 font-bold" onClick={onDelete}>
            Delete Faculty Profile
          </Button>
        )}
      </div>
    </form>
  );
}
