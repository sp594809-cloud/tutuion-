import { X } from "lucide-react";
import { Button } from "@/components/ui";

export function Sheet({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 mx-auto flex max-w-md flex-col bg-bg">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="ghost" className="size-11 px-0" onClick={onClose} aria-label="Close">
          <X className="size-5" />
        </Button>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
    </div>
  );
}
