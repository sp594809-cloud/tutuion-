import { cn } from "@/lib/utils";

export function Meter({
  pct,
  tone = "primary",
}: {
  pct: number;
  tone?: "primary" | "success" | "danger" | "warn";
}) {
  const w = Math.max(0, Math.min(100, pct));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
      <div
        className={cn(
          "h-full rounded-full",
          tone === "primary" && "bg-primary",
          tone === "success" && "bg-success",
          tone === "danger" && "bg-danger",
          tone === "warn" && "bg-warn",
        )}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

export function RankRow({
  name,
  value,
  suffix,
  pct,
  tone,
}: {
  name: string;
  value: string;
  suffix?: string;
  pct: number;
  tone?: "primary" | "success" | "danger" | "warn";
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-sm font-medium">{name}</span>
        <span className="shrink-0 text-sm font-semibold tabular-nums">
          {value}
          {suffix ? <span className="font-normal text-muted"> {suffix}</span> : null}
        </span>
      </div>
      <Meter pct={pct} tone={tone} />
    </div>
  );
}
