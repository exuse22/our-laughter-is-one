import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ResellersManager from "./resellers-manager";

export const instant = false;

async function ResellersContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (
    !user?.email ||
    !adminEmail ||
    user.email.trim().toLowerCase() !== adminEmail
  ) {
    redirect("/login");
  }

  return <ResellersManager />;
}

export default function ResellersPage() {
  return (
    <main className="min-h-screen bg-[#090806] text-[#f2dfbd] px-4 py-10">
      <ResellersContent />
    </main>
  );
}