import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, FileText, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Card, Field, Input, Select } from "@/components/ui";
import { useTuition } from "@/lib/store";
import { getWhatsAppLink, prettyDate } from "@/lib/utils";

export const Route = createFileRoute("/papers")({ component: PapersPage });

type PaperItem = {
  id: string;
  title: string;
  subject: string;
  batchId: string;
  fileUrl: string;
  notes?: string;
  createdAt: string;
};

export function PapersPage() {
  const batches = useTuition((s) => s.batches);
  const students = useTuition((s) => s.students);

  // Initial seed paper list (read-only)
  const [papers] = useState<PaperItem[]>([
    {
      id: "paper-1",
      title: "Class 10 Maths Algebra Practice Paper - Chapter 1 & 2",
      subject: "Maths",
      batchId: "batch-maths",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      notes: "Contains 25 Board Exam style questions with step-by-step solutions.",
      createdAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: "paper-2",
      title: "Class 9 Science Physics Motion & Force Test Paper",
      subject: "Science",
      batchId: "batch-science",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      notes: "Formula cheat sheet included on page 3.",
      createdAt: new Date().toISOString().slice(0, 10),
    },
  ]);

  const [filterBatch, setFilterBatch] = useState<string>("all");

  const filteredPapers = useMemo(() => {
    if (filterBatch === "all") return papers;
    return papers.filter((p) => p.batchId === filterBatch);
  }, [papers, filterBatch]);

  function handleShareWhatsApp(paper: PaperItem) {
    const batchObj = batches.find((b) => b.id === paper.batchId);
    const targetStudents = students.filter((s) => s.batchId === paper.batchId);
    const phone = targetStudents[0]?.parentPhone || "";

    const msg =
      `📄 *QUESTION PAPER / STUDY NOTES*\n` +
      `-----------------------------\n` +
      `📌 *Title:* ${paper.title}\n` +
      `📚 *Subject:* ${paper.subject} (${batchObj?.name || "Tuition Batch"})\n` +
      `📅 *Date:* ${prettyDate(paper.createdAt)}\n` +
      (paper.notes ? `📝 *Notes:* ${paper.notes}\n` : "") +
      `-----------------------------\n` +
      `🔗 *Click to View & Download PDF:* \n${paper.fileUrl}\n\n` +
      `Please practice this question paper.`;

    window.open(getWhatsAppLink(phone, msg), "_blank");
  }

  return (
    <div className="px-4 pt-4 space-y-4 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Question Papers & Notes</h1>
          <p className="text-xs text-muted">Read-only PDF bank (admin upload removed)</p>
        </div>
      </div>

      {/* Filter by Batch */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-muted">Filter Batch:</span>
        <Select value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)} className="w-48 text-xs font-medium">
          <option value="all">All Batches</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Question Papers List (read-only) */}
      <div className="space-y-3">
        {filteredPapers.length === 0 ? (
          <Card className="p-8 text-center text-muted">
            <FileText className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">No question papers found for this batch.</p>
          </Card>
        ) : (
          filteredPapers.map((paper) => {
            const batchObj = batches.find((b) => b.id === paper.batchId);
            return (
              <Card key={paper.id} className="p-4 space-y-2 hover:border-primary/40 transition-all shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                      {batchObj?.name || paper.batchId} · {paper.subject}
                    </span>
                    <h3 className="text-sm font-bold leading-snug text-gray-900">{paper.title}</h3>
                    {paper.notes && <p className="text-xs text-muted">{paper.notes}</p>}
                    <p className="text-[10px] text-subtle">Added: {prettyDate(paper.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <a
                    href={paper.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition-colors"
                  >
                    <ExternalLink className="size-3.5" />
                    Open PDF Paper
                  </a>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(paper)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <Share2 className="size-3.5" />
                    Send WhatsApp PDF Link
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
