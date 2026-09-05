import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Sheet } from "@/components/sheet";
import { Button, Field, Input } from "@/components/ui";
import { useTuition } from "@/lib/store";
import { inr } from "@/lib/utils";

export const Route = createFileRoute("/batches")({ component: BatchesPage });

function BatchesPage() {
  const batches = useTuition((s) => s.batches);
  const students = useTuition((s) => s.students);
  const addBatch = useTuition((s) => s.addBatch);
  const [open, setOpen] = useState(false);

  return (
    <div className="px-4 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Batches</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>
      {batches.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No batches yet.</p>
      ) : (
        <ul className="space-y-2">
          {batches.map((b) => {
            const count = students.filter((s) => s.batchId === b.id).length;
            return (
              <li key={b.id}>
                <Link
                  to="/batches/$batchId"
                  params={{ batchId: b.id }}
                  className="block rounded-xl bg-surface px-4 py-3 ring-1 ring-border"
                >
                  <p className="font-medium">{b.name}</p>
                  <p className="text-xs text-muted">
                    {count} students · {inr(b.monthlyFee)} / month
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Sheet title="Add batch" open={open} onClose={() => setOpen(false)}>
        <AddBatchForm
          onSave={(data) => {
            addBatch(data);
            setOpen(false);
          }}
        />
      </Sheet>
    </div>
  );
}

function AddBatchForm({
  onSave,
}: {
  onSave: (d: { name: string; className: string; subject: string; monthlyFee: number }) => void;
}) {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [fee, setFee] = useState("1500");
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          name: name.trim() || `Class ${className} ${subject}`.trim(),
          className: className.trim(),
          subject: subject.trim(),
          monthlyFee: Number(fee) || 0,
        });
      }}
    >
      <Field label="Batch name">
        <Input
          required
          placeholder="Class 10 Maths"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>
      <Field label="Class">
        <Input placeholder="10" value={className} onChange={(e) => setClassName(e.target.value)} />
      </Field>
      <Field label="Subject">
        <Input placeholder="Maths" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </Field>
      <Field label="Default monthly fee (₹)">
        <Input inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value)} />
      </Field>
      <Button className="w-full" type="submit" disabled={!name.trim()}>
        Save batch
      </Button>
    </form>
  );
}
