import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui";
import { useTuition } from "@/lib/store";
import { inr } from "@/lib/utils";

export const Route = createFileRoute("/batches/$batchId")({ component: BatchDetail });

function BatchDetail() {
  const { batchId } = Route.useParams();
  const navigate = useNavigate();
  const batch = useTuition((s) => s.batches.find((b) => b.id === batchId));
  const students = useTuition((s) => s.students.filter((x) => x.batchId === batchId));
  const deleteBatch = useTuition((s) => s.deleteBatch);

  if (!batch) return <p className="px-4 pt-8 text-sm text-muted">Batch not found.</p>;

  return (
    <div className="px-4 pt-4">
      <h1 className="text-xl font-semibold">{batch.name}</h1>
      <p className="mb-4 text-sm text-muted">
        Class {batch.className} · {batch.subject} · {inr(batch.monthlyFee)}
      </p>
      <h2 className="mb-2 text-sm font-semibold text-muted">Students</h2>
      {students.length === 0 ? (
        <p className="text-sm text-muted">No students in this batch.</p>
      ) : (
        <ul className="space-y-2">
          {students.map((s) => (
            <li key={s.id}>
              <Link
                to="/students/$studentId"
                params={{ studentId: s.id }}
                className="flex justify-between rounded-xl bg-surface px-4 py-3 ring-1 ring-border"
              >
                <span className="font-medium">{s.name}</span>
                <span className={s.dueAmount > 0 ? "text-sm text-danger tabular-nums" : "text-sm text-success"}>
                  {s.dueAmount > 0 ? inr(s.dueAmount) : "Paid"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Button
        variant="danger"
        className="mt-6 w-full"
        onClick={() => {
          if (window.confirm("Delete this batch and its students?")) {
            deleteBatch(batch.id);
            void navigate({ to: "/batches" });
          }
        }}
      >
        Delete batch
      </Button>
    </div>
  );
}
