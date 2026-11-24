
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push(
        `/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090806] px-6 py-12 text-[#f2dfbd]">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-xl border border-[#bd9145]/40 bg-[#17130e] p-8"
      >
        <p className="text-center text-xs tracking-[0.4em] text-[#d9ad5c]">
          OUR LAUGHTER IS ONE
        </p>

        <h1 className="mt-6 text-center font-[var(--font-cormorant)] text-4xl">
          Create Your Account
        </h1>

        <p className="mt-3 text-center text-sm text-[#bfb19d]">
          Join our community of readers.
        </p>

        <label className="mt-8 block text-sm">Full Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded border border-[#bd9145]/50 bg-[#090806] p-4 outline-none focus:border-[#e8bd65]"
          placeholder="Enter your full name"
        />

        <label className="mt-5 block text-sm">Email Address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded border border-[#bd9145]/50 bg-[#090806] p-4 outline-none focus:border-[#e8bd65]"
          placeholder="Enter your email"
        />

        <label className="mt-5 block text-sm">Password</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded border border-[#bd9145]/50 bg-[#090806] p-4 outline-none focus:border-[#e8bd65]"
          placeholder="At least 8 characters"
        />

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded bg-[#bd9145] p-4 font-semibold text-[#090806] transition hover:bg-[#e8bd65] disabled:opacity-50"
        >
          {loading ? "Creating account..." : "CREATE ACCOUNT"}
        </button>

        <p className="mt-6 text-center text-sm text-[#bfb19d]">
          Already registered?{" "}
          <a href="/customer-login" className="text-[#e8bd65] underline">
            Sign in
          </a>
        </p>
      </form>
    </main>
  );
}
