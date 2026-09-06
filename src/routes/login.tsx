import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { login as loginFn, getCurrentUser } from "@/lib/auth/server-fns";

export const Route = createFileRoute("/login")({ component: LoginPage });

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res: any = await loginFn({ data: { email: email.trim(), password } });
      if (!res || !res.success) {
        setError(res?.error || "Login failed. Check credentials.");
        setLoading(false);
        return;
      }

      const user = res.user;
      // Redirect by role
      if (user?.role === "super_admin") {
        await navigate({ to: "/super-admin" });
      } else {
        await navigate({ to: "/" });
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  // If already logged in, redirect away
  async function checkSession() {
    try {
      const res: any = await getCurrentUser();
      if (res?.success && res?.user) {
        const u = res.user;
        if (u.role === "super_admin") navigate({ to: "/super-admin" });
        else navigate({ to: "/" });
      }
    } catch (err) {
      // ignore
    }
  }

  // run check on first render
  if (typeof window !== "undefined") {
    // fire-and-forget; navigation will redirect if needed
    void checkSession();
  }

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="Email">
            <Input
              type="email"
              placeholder="you@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field label="Password">
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" className="font-bold flex-1" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>

        <p className="text-sm text-muted">If you don't have an account, ask the institute admin to create one.</p>
      </div>
    </main>
  );
}
