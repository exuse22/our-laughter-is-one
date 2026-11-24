
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const email = searchParams.get("email") || "";

  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: "signup",
      });

      if (error) {
        setError("Invalid or expired code. Please try again.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090806] px-6 py-12 text-[#f2dfbd]">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md rounded-xl border border-[#bd9145]/40 bg-[#17130e] p-8"
      >
        <p className="text-center text-xs tracking-[0.4em] text-[#d9ad5c]">
          OUR LAUGHTER IS ONE
        </p>

        <h1 className="mt-6 text-center font-[var(--font-cormorant)] text-4xl">
          Verify Your Email
        </h1>

        <p className="mt-4 text-center text-sm text-[#bfb19d]">
          Enter the six-digit code sent to:
        </p>

        <p className="mt-2 text-center text-sm text-[#e8bd65]">
          {email}
        </p>

        <label className="mt-8 block text-sm">
          Verification Code
        </label>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          minLength={6}
          pattern="[0-9]{6}"
          required
          value={token}
          onChange={(e) =>
            setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className="mt-2 w-full rounded border border-[#bd9145]/50 bg-[#090806] p-4 text-center text-2xl tracking-[0.5em] outline-none focus:border-[#e8bd65]"
          placeholder="000000"
        />

        {error && (
          <p className="mt-4 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || token.length !== 6 || !email}
          className="mt-7 w-full rounded bg-[#bd9145] p-4 font-semibold text-[#090806] transition hover:bg-[#e8bd65] disabled:opacity-50"
        >
          {loading ? "VERIFYING..." : "VERIFY EMAIL"}
        </button>
      </form>
    </main>
  );
}
