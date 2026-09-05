import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardCheck,
  House,
  LayoutGrid,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useTuition } from "@/lib/store";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: House, match: (p: string) => p === "/" },
  {
    to: "/students",
    label: "Students",
    icon: Users,
    match: (p: string) => p.startsWith("/students"),
  },
  {
    to: "/attendance",
    label: "Attend",
    icon: ClipboardCheck,
    match: (p: string) => p.startsWith("/attendance"),
  },
  {
    to: "/fees",
    label: "Fees",
    icon: Wallet,
    match: (p: string) => p.startsWith("/fees"),
  },
  {
    to: "/more",
    label: "More",
    icon: LayoutGrid,
    match: (p: string) =>
      p.startsWith("/more") ||
      p.startsWith("/batches") ||
      p.startsWith("/marks") ||
      p.startsWith("/reports") ||
      p.startsWith("/faculty"),
  },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const institute = useTuition((s) => s.institute);
  const teachers = useTuition((s) => s.teachers);
  const activeTeacherId = useTuition((s) => s.activeTeacherId);

  const activeTeacher = teachers.find((t) => t.id === activeTeacherId) || teachers[0];

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-bg">
      <header className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-surface/80 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-fg shadow">
            <BookOpen className="size-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-muted uppercase">TuitionEasy</p>
            <p className="text-sm font-black leading-tight text-gray-900">{institute || "My Tuition"}</p>
          </div>
        </div>

        {/* Active Faculty Login Badge */}
        <Link
          to="/faculty"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-xs font-bold text-primary transition-all"
          title="Click to Switch or Edit Faculty Login"
        >
          <UserCheck className="size-3.5" />
          <div className="text-left">
            <span className="block leading-none">{activeTeacher ? activeTeacher.name : "Faculty Login"}</span>
            <span className="text-[9px] text-primary/80 font-normal">
              {activeTeacher && activeTeacher.subjects ? activeTeacher.subjects[0] : "All Subjects"}
            </span>
          </div>
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">{children}</main>

      <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
        <ul className="grid grid-cols-5">
          {tabs.map((t) => {
            const active = t.match(pathname);
            const Icon = t.icon;
            return (
              <li key={t.to}>
                <Link
                  to={t.to}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                    active ? "text-primary" : "text-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
