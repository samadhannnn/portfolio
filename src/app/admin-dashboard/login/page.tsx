"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../actions";
import { Shield, Key, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(password);
      if (res.success) {
        router.push("/admin-dashboard");
        router.refresh();
      } else {
        setError(res.error || "Authentication failed");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 bg-grid-pattern relative">
      {/* Return button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Site
        </Link>
      </div>

      <div className="w-full max-w-md p-8 rounded-xl border border-border bg-card shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3.5 bg-accent/10 rounded-full text-accent mb-4">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold font-heading text-foreground">Secret Admin Access</h1>
          <p className="text-xs text-secondary mt-1">Authorized portfolio administration node</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2"
            >
              Access Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all disabled:opacity-65"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-lg bg-accent text-white font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-65"
          >
            {loading ? "Decrypting..." : "Decrypt Credentials"}
          </button>
        </form>
      </div>
    </div>
  );
}
