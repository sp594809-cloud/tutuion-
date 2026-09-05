import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked, ChevronRight, Download, FileSpreadsheet, FileText, HardDriveDownload, HardDriveUpload, Layers, LineChart, MessageSquare, ShieldCheck, UserCheck, Users } from "lucide-react";

import { useRef, useState } from "react";
import { Button, Card, Field, Input } from "@/components/ui";
import { useTuition } from "@/lib/store";
import { exportToCSV, prettyDate } from "@/lib/utils";

export const Route = createFileRoute("/more")({ component: MorePage });

function MorePage() {
  const institute = useTuition((s) => s.institute);
  const setInstitute = useTuition((s) => s.setInstitute);
  const teachers = useTuition((s) => s.teachers);
  const activeTeacherId = useTuition((s) => s.activeTeacherId);

  const students = useTuition((s) => s.students);
  const batches = useTuition((s) => s.batches);
  const payments = useTuition((s) => s.payments);
  const attendance = useTuition((s) => s.attendance);
  const tests = useTuition((s) => s.tests);
  const marks = useTuition((s) => s.marks);

  const [importStatus, setImportStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTeacher = teachers.find((t) => t.id === activeTeacherId) || teachers[0];

  const items = [
    { to: "/faculty", label: "Faculty & Teacher Login", hint: "Switch teachers, subjects & credentials", icon: UserCheck },
    { to: "/papers", label: "Question Papers & Notes", hint: "Cloudflare R2 / PDF bank & 1-click WhatsApp share", icon: FileText },
    { to: "/batches", label: "Batches & Classes", hint: "Manage batches and monthly fees", icon: Layers },
    { to: "/marks", label: "Marks & Exam Performance", hint: "Tests, head-to-head comparison & WhatsApp report card", icon: BookMarked },
    { to: "/reports", label: "Reports & Analytics", hint: "Monthly fee collection & attendance trends", icon: LineChart },
  ] as const;

  // Export Full JSON Backup
  function handleExportBackup() {
    const fullData = {
      version: 4,
      exportedAt: new Date().toISOString(),
      institute,
      teachers,
      activeTeacherId,
      batches,
      students,
      attendance,
      payments,
      tests,
      marks,
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${institute.replace(/\s+/g, "-")}-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Import JSON Backup
  function handleImportBackup(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.students && json.batches) {
          useTuition.setState({
            institute: json.institute || institute,
            teachers: json.teachers || teachers,
            activeTeacherId: json.activeTeacherId || activeTeacherId,
            batches: json.batches || [],
            students: json.students || [],
            attendance: json.attendance || [],
            payments: json.payments || [],
            tests: json.tests || [],
            marks: json.marks || [],
          });
          setImportStatus("✓ Data backup successfully restored!");
        } else {
          setImportStatus("✕ Invalid backup file structure.");
        }
      } catch (err) {
        setImportStatus("✕ Failed to parse backup file.");
      }
    };
    reader.readAsText(file);
  }

  // Export Students CSV
  function handleExportStudentsCSV() {
    const rows = students.map((s) => {
      const b = batches.find((batch) => batch.id === s.batchId);
      return {
        "Student ID": s.id,
        "Student Name": s.name,
        "Parent Name": s.parentName,
        "Parent Phone": s.parentPhone,
        "Student Phone": s.studentPhone || "",
        Batch: b?.name ?? "",
        Subject: b?.subject ?? "",
        "Monthly Fee (₹)": s.monthlyFee,
        "Pending Fee (₹)": s.dueAmount,
        "Joined Date": s.joinedAt,
      };
    });
    exportToCSV(`${institute}-Students-Roster`, rows);
  }

  // Export Payments CSV
  function handleExportPaymentsCSV() {
    const rows = payments.map((p) => {
      const s = students.find((st) => st.id === p.studentId);
      return {
        "Payment ID": p.id,
        "Student Name": s?.name ?? "",
        "Amount (₹)": p.amount,
        Date: prettyDate(p.date),
        Mode: p.mode.toUpperCase(),
      };
    });
    exportToCSV(`${institute}-Fee-Payments`, rows);
  }

  return (
    <div className="px-4 pt-4 space-y-5 pb-12">
      <h1 className="text-xl font-bold tracking-tight">Settings & Profile</h1>

      {/* Active Faculty Overview Banner */}
      <Link
        to="/faculty"
        className="block p-4 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-md border border-indigo-700 hover:border-indigo-500 transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-300">Active Faculty Profile</span>
            <h2 className="text-base font-black">{activeTeacher ? activeTeacher.name : "Setup Faculty Login"}</h2>
            <p className="text-xs text-indigo-200 mt-0.5">
              {activeTeacher ? `Mo. ${activeTeacher.phone} · ${activeTeacher.email}` : "Click to add faculty details"}
            </p>
          </div>
          <span className="text-xs font-bold bg-white text-gray-900 px-3 py-1.5 rounded-lg shadow">
            Edit / Switch &rarr;
          </span>
        </div>
      </Link>

      {/* Quick Nav Items */}
      <ul className="space-y-2">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3.5 ring-1 ring-border shadow-sm hover:ring-primary/50 transition-all"
              >
                <Icon className="size-5 text-primary" />
                <span className="flex-1">
                  <span className="block font-semibold text-sm">{it.label}</span>
                  <span className="text-xs text-muted">{it.hint}</span>
                </span>
                <ChevronRight className="size-4 text-subtle" />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Production Backup & Data Export Tools */}
      <Card className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600" />
            Backup & Data Export Center
          </h3>
          <p className="text-xs text-muted mt-1">Export spreadsheets or save full system backups so your student data is 100% safe.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleExportStudentsCSV}
            className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-100 transition-all"
          >
            <FileSpreadsheet className="size-4 text-emerald-600" />
            <span>Export Students (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleExportPaymentsCSV}
            className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-100 transition-all"
          >
            <FileSpreadsheet className="size-4 text-emerald-600" />
            <span>Export Payments (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800 hover:bg-indigo-100 transition-all"
          >
            <HardDriveDownload className="size-4 text-indigo-600" />
            <span>Download JSON Backup</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-800 hover:bg-purple-100 transition-all"
          >
            <HardDriveUpload className="size-4 text-purple-600" />
            <span>Restore JSON Backup</span>
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportBackup}
          accept=".json"
          className="hidden"
        />

        {importStatus && (
          <p className="text-xs font-semibold text-center text-emerald-600 pt-1">{importStatus}</p>
        )}
      </Card>
    </div>
  );
}
