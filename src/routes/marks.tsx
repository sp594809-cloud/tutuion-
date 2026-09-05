import { createFileRoute } from "@tanstack/react-router";
import { Award, BarChart3, MessageSquare, Plus, Share2, Trophy, Users } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Sheet } from "@/components/sheet";
import { Button, Card, Field, Input, Select } from "@/components/ui";
import { useTuition } from "@/lib/store";
import { cn, generateMarksWhatsApp, getWhatsAppLink, prettyDate, todayISO } from "@/lib/utils";

export const Route = createFileRoute("/marks")({ component: MarksPage });

function MarksPage() {
  const batches = useTuition((s) => s.batches);
  const students = useTuition((s) => s.students);
  const tests = useTuition((s) => s.tests);
  const marks = useTuition((s) => s.marks);
  const addTest = useTuition((s) => s.addTest);
  const saveMarks = useTuition((s) => s.saveMarks);
  const institute = useTuition((s) => s.institute);
  const teachers = useTuition((s) => s.teachers);
  const activeTeacherId = useTuition((s) => s.activeTeacherId);

  const activeTeacher = teachers.find((t) => t.id === activeTeacherId) || teachers[0];

  const [activeTab, setActiveTab] = useState<"entry" | "comparison">("entry");
  const [batchId, setBatchId] = useState(batches[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const batchTests = useMemo(
    () => tests.filter((t) => t.batchId === batchId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [tests, batchId],
  );
  const batchStudents = useMemo(
    () => students.filter((s) => s.batchId === batchId).sort((a, b) => a.name.localeCompare(b.name)),
    [students, batchId],
  );
  const test = tests.find((t) => t.id === active);
  const currentBatch = batches.find((b) => b.id === batchId);

  useMemo(() => {
    if (batchStudents.length > 0 && selectedStudents.length === 0) {
      setSelectedStudents(batchStudents.slice(0, 2).map((s) => s.id));
    }
  }, [batchStudents]);

  const analytics = useMemo(() => {
    const batchMarks = marks.filter((m) => {
      const t = tests.find((testItem) => testItem.id === m.testId);
      return t?.batchId === batchId;
    });

    const studentPerformance = batchStudents.map((s) => {
      const sMarks = batchMarks.filter((m) => m.studentId === s.id);
      let totalScored = 0;
      let totalMax = 0;

      sMarks.forEach((m) => {
        const t = tests.find((testItem) => testItem.id === m.testId);
        if (t) {
          totalScored += m.score;
          totalMax += t.maxMarks;
        }
      });

      const avgPercentage = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 0;
      let grade = "C";
      if (avgPercentage >= 90) grade = "A+";
      else if (avgPercentage >= 75) grade = "A";
      else if (avgPercentage >= 60) grade = "B";
      else if (avgPercentage >= 50) grade = "C";
      else grade = "Need Imp.";

      return {
        student: s,
        totalScored,
        totalMax,
        avgPercentage,
        grade,
        testsCount: sMarks.length,
      };
    }).sort((a, b) => b.avgPercentage - a.avgPercentage);

    const comparisonData = batchTests.map((t) => {
      const item: Record<string, any> = {
        testName: t.name,
        maxMarks: t.maxMarks,
      };

      const tMarks = marks.filter((m) => m.testId === t.id);
      const tTotal = tMarks.reduce((acc, curr) => acc + curr.score, 0);
      const batchAvgPct = tMarks.length > 0 ? Math.round((tTotal / (tMarks.length * t.maxMarks)) * 100) : 0;
      item["Batch Avg %"] = batchAvgPct;

      selectedStudents.forEach((stId) => {
        const st = batchStudents.find((s) => s.id === stId);
        const mark = tMarks.find((m) => m.studentId === stId);
        if (st) {
          const scorePct = mark ? Math.round((mark.score / t.maxMarks) * 100) : 0;
          item[st.name] = scorePct;
        }
      });

      return item;
    });

    const gradeCounts = {
      "A+ (>90%)": studentPerformance.filter((s) => s.avgPercentage >= 90).length,
      "A (75-89%)": studentPerformance.filter((s) => s.avgPercentage >= 75 && s.avgPercentage < 90).length,
      "B (60-74%)": studentPerformance.filter((s) => s.avgPercentage >= 60 && s.avgPercentage < 75).length,
      "C (50-59%)": studentPerformance.filter((s) => s.avgPercentage >= 50 && s.avgPercentage < 60).length,
      "Need Imp. (<50%)": studentPerformance.filter((s) => s.avgPercentage < 50).length,
    };

    const pieData = Object.entries(gradeCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));

    const topScorer = studentPerformance[0];
    const classAvgPct =
      studentPerformance.length > 0
        ? Math.round(studentPerformance.reduce((acc, curr) => acc + curr.avgPercentage, 0) / studentPerformance.length)
        : 0;

    return {
      studentPerformance,
      comparisonData,
      pieData,
      topScorer,
      classAvgPct,
    };
  }, [batchId, batchStudents, batchTests, marks, tests, selectedStudents]);

  const toggleStudentSelection = (id: string) => {
    if (selectedStudents.includes(id)) {
      if (selectedStudents.length > 1) {
        setSelectedStudents(selectedStudents.filter((s) => s !== id));
      }
    } else {
      if (selectedStudents.length < 4) {
        setSelectedStudents([...selectedStudents, id]);
      }
    }
  };

  const chartColors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];
  const pieColors = ["#10b981", "#3b82f6", "#f59e0b", "#a855f7", "#ef4444"];

  return (
    <div className="px-4 pt-4 space-y-4 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Marks & Tests</h1>
        <div className="flex rounded-lg bg-surface p-1 ring-1 ring-border">
          <button
            type="button"
            onClick={() => setActiveTab("entry")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              activeTab === "entry" ? "bg-primary text-primary-fg shadow" : "text-muted hover:text-fg",
            )}
          >
            <Plus className="size-3.5" />
            Tests & Marks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("comparison")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              activeTab === "comparison" ? "bg-primary text-primary-fg shadow" : "text-muted hover:text-fg",
            )}
          >
            <BarChart3 className="size-3.5" />
            Dashboard & Compare
          </button>
        </div>
      </div>

      <Select value={batchId} onChange={(e) => setBatchId(e.target.value)}>
        {batches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </Select>

      {activeTab === "entry" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted">Test Schedule</h2>
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" />
              New Test
            </Button>
          </div>

          {batchTests.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No tests added yet for this batch.</p>
          ) : (
            <ul className="space-y-2">
              {batchTests.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setActive(t.id)}
                    className="flex w-full items-center justify-between rounded-xl bg-surface px-4 py-3 text-left ring-1 ring-border shadow-sm hover:ring-primary/50 transition-all"
                  >
                    <div>
                      <span className="block font-semibold text-sm">{t.name}</span>
                      <span className="text-xs text-muted">
                        {prettyDate(t.date)} · Max: {t.maxMarks} marks
                      </span>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      Enter Marks & Send Report &rarr;
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Card className="p-3.5 flex flex-col justify-between">
              <span className="text-xs text-muted font-medium">Batch Class Average</span>
              <p className="mt-2 text-2xl font-black tracking-tight text-indigo-600">{analytics.classAvgPct}%</p>
            </Card>
            <Card className="p-3.5 flex flex-col justify-between">
              <span className="text-xs text-muted font-medium">Batch Top Scorer</span>
              <p className="mt-2 text-base font-extrabold tracking-tight truncate text-emerald-600">
                {analytics.topScorer ? analytics.topScorer.student.name : "N/A"}
              </p>
              <p className="text-[11px] text-muted">{analytics.topScorer ? `${analytics.topScorer.avgPercentage}% avg` : ""}</p>
            </Card>
            <Card className="p-3.5 flex flex-col justify-between col-span-2 sm:col-span-1">
              <span className="text-xs text-muted font-medium">Total Tests Conducted</span>
              <p className="mt-2 text-2xl font-black tracking-tight">{batchTests.length} tests</p>
            </Card>
          </div>

          {/* Student Mark Comparison Section */}
          <Card className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BarChart3 className="size-4 text-indigo-600" />
                Head-to-Head Student Comparison Chart
              </h3>
              <p className="text-xs text-muted mt-1">Select up to 4 students to compare performance across tests (%)</p>
            </div>

            {/* Student Chip Selector */}
            <div className="flex flex-wrap gap-1.5">
              {batchStudents.map((s) => {
                const isSelected = selectedStudents.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleStudentSelection(s.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold transition-all border",
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow"
                        : "bg-surface text-muted border-border hover:bg-bg",
                    )}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {s.name}
                  </button>
                );
              })}
            </div>

            {/* Recharts Bar Comparison Chart */}
            {analytics.comparisonData.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted">No test marks available for comparison.</p>
            ) : (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.comparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="testName" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    <Bar dataKey="Batch Avg %" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    {selectedStudents.map((stId, idx) => {
                      const st = batchStudents.find((s) => s.id === stId);
                      if (!st) return null;
                      return (
                        <Bar
                          key={st.id}
                          dataKey={st.name}
                          fill={chartColors[idx % chartColors.length]}
                          radius={[4, 4, 0, 0]}
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Leaderboard Table & Grade Distribution */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Rank Leaderboard */}
            <Card className="p-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Trophy className="size-4 text-amber-500" />
                Batch Leaderboard & Rankings
              </h3>
              {analytics.studentPerformance.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted">No student scores found.</p>
              ) : (
                <div className="space-y-2">
                  {analytics.studentPerformance.map((st, rank) => (
                    <div
                      key={st.student.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-border text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px]",
                            rank === 0
                              ? "bg-amber-400 text-amber-950"
                              : rank === 1
                              ? "bg-slate-300 text-slate-900"
                              : rank === 2
                              ? "bg-amber-700 text-white"
                              : "bg-gray-100 text-gray-700",
                          )}
                        >
                          {rank + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900">{st.student.name}</p>
                          <p className="text-[10px] text-muted">{st.testsCount} tests recorded</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm text-indigo-600 block">{st.avgPercentage}%</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100">{st.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Grade Distribution Chart */}
            <Card className="p-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Award className="size-4 text-emerald-600" />
                Grade Distribution
              </h3>
              {analytics.pieData.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted">No performance data yet.</p>
              ) : (
                <div className="h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, value }) => `${name.split(" ")[0]}: ${value}`}
                      >
                        {analytics.pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Sheet Modals */}
      <Sheet title="New Test" open={open} onClose={() => setOpen(false)}>
        <NewTestForm
          batchId={batchId}
          onSave={(data) => {
            addTest(data);
            setOpen(false);
          }}
        />
      </Sheet>

      <Sheet title={test?.name ?? "Enter Marks & Send Reports"} open={!!test} onClose={() => setActive(null)}>
        {test && (
          <MarksForm
            test={test}
            batchSubject={currentBatch?.subject}
            instituteName={activeTeacher?.instituteName || institute}
            teacherName={activeTeacher?.name}
            teacherPhone={activeTeacher?.phone}
            students={batchStudents}
            initial={Object.fromEntries(
              marks.filter((m) => m.testId === test.id).map((m) => [m.studentId, String(m.score)]),
            )}
            onSave={(rows) => {
              saveMarks(test.id, rows);
              setActive(null);
            }}
          />
        )}
      </Sheet>
    </div>
  );
}

function NewTestForm({
  batchId,
  onSave,
}: {
  batchId: string;
  onSave: (d: { batchId: string; name: string; maxMarks: number; date: string }) => void;
}) {
  const [name, setName] = useState("");
  const [max, setMax] = useState("50");
  const [date, setDate] = useState(todayISO());

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          batchId,
          name: name.trim(),
          maxMarks: Number(max) || 50,
          date,
        });
      }}
    >
      <Field label="Test Name">
        <Input required placeholder="e.g. Algebra Unit Test 1" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Max Marks">
        <Input inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} />
      </Field>
      <Field label="Test Date">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>
      <Button className="w-full h-11 text-sm font-bold" type="submit" disabled={!name.trim()}>
        Save Test &rarr;
      </Button>
    </form>
  );
}

function MarksForm({
  test,
  batchSubject,
  instituteName,
  teacherName,
  teacherPhone,
  students,
  initial,
  onSave,
}: {
  test: { id: string; name: string; maxMarks: number; date: string };
  batchSubject?: string;
  instituteName: string;
  teacherName?: string;
  teacherPhone?: string;
  students: { id: string; name: string; parentName: string; parentPhone: string; studentPhone?: string }[];
  initial: Record<string, string>;
  onSave: (rows: { studentId: string; score: number }[]) => void;
}) {
  const [scores, setScores] = useState<Record<string, string>>(initial);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(
          students.map((s) => ({
            studentId: s.id,
            score: Math.min(test.maxMarks, Math.max(0, Number(scores[s.id]) || 0)),
          })),
        );
      }}
    >
      <div className="space-y-3">
        {students.map((s) => {
          const scoreNum = Number(scores[s.id]) || 0;
          const parentMsg = generateMarksWhatsApp({
            studentName: s.name,
            parentName: s.parentName,
            testName: test.name,
            subject: batchSubject,
            score: scoreNum,
            maxMarks: test.maxMarks,
            date: test.date,
            instituteName,
            teacherName,
            teacherPhone,
          });

          return (
            <div key={s.id} className="p-3 rounded-xl bg-surface border border-border space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{s.name}</p>
                  <p className="text-[11px] text-muted truncate">Parent: {s.parentPhone}</p>
                </div>
                <Input
                  className="w-20 text-center font-bold text-base"
                  inputMode="numeric"
                  placeholder="0"
                  value={scores[s.id] ?? ""}
                  onChange={(e) => setScores((x) => ({ ...x, [s.id]: e.target.value }))}
                />
              </div>

              {/* 1-Click WhatsApp Direct Notification Actions */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-border/50">
                <a
                  href={getWhatsAppLink(s.parentPhone, parentMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
                >
                  <MessageSquare className="size-3.5" />
                  <span>Send Parent WhatsApp</span>
                </a>

                {s.studentPhone && (
                  <a
                    href={getWhatsAppLink(s.studentPhone, parentMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    <MessageSquare className="size-3.5" />
                    <span>Send Student WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted text-right">Out of {test.maxMarks} marks</p>
      <Button className="w-full h-11 text-sm font-bold shadow-lg" type="submit">
        Save All Marks
      </Button>
    </form>
  );
}
