
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090806] px-6 text-[#f2dfbd]">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-xl border border-[#bd9145]/40 bg-[#17130e] p-8"
      >
        <p className="text-center text-xs tracking-[0.4em] text-[#d9ad5c]">
          OUR LAUGHTER IS ONE
        </p>

        <h1 className="mt-6 text-center font-[var(--font-cormorant)] text-4xl">
          Admin Login
        </h1>

        <p className="mt-3 text-center text-sm text-[#bfb19d]">
          Authorized administrators only.
        </p>

        <label className="mt-8 block text-sm">Admin Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded border border-[#bd9145]/50 bg-[#090806] p-4 outline-none focus:border-[#e8bd65]"
          placeholder="Enter admin email"
        />

        <label className="mt-5 block text-sm">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded border border-[#bd9145]/50 bg-[#090806] p-4 outline-none focus:border-[#e8bd65]"
          placeholder="Enter password"
        />

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded bg-[#bd9145] p-4 font-semibold text-[#090806] transition hover:bg-[#e8bd65] disabled:opacity-50"
        >
          {loading ? "Signing in..." : "SIGN IN"}
        </button>
      </form>
    </main>
  );
}
