
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import OrdersTable from "../orders-table";

export const instant = false;

async function OrdersContent() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user ||
    user.email?.toLowerCase() !==
      process.env.ADMIN_EMAIL?.toLowerCase()
  ) {
    redirect("/login");
  }

  const adminSupabase = createAdminClient();

  const { data: orders, error } = await adminSupabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Could not load customer orders.");
  }

  return (
    <main className="min-h-screen bg-[#090806] p-6 text-[#f2dfbd] md:p-10">
      <div className="mx-auto max-w-7xl">

        <Link
          href="/admin"
          className="text-sm text-[#d9ad5c] hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8">
          <p className="text-xs tracking-[0.3em] text-[#d9ad5c]">
            MANAGEMENT
          </p>

          <h1 className="mt-3 font-[var(--font-cormorant)] text-4xl text-[#e8bd65]">
            Orders
          </h1>

          <p className="mt-3 text-sm text-[#bfb19d]">
            Manage and review your customer orders.
          </p>
        </div>

        <div className="mt-10 rounded-xl border border-[#bd9145]/30 bg-[#17130e] p-6">
          <h2 className="mb-6 text-xl text-[#e8bd65]">
            All Customer Orders
          </h2>

          <OrdersTable initialOrders={orders ?? []} />
        </div>

      </div>
    </main>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090806] p-10 text-[#d9ad5c]">
          Loading Orders...
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
