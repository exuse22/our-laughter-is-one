
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
export const instant = false;
export default async function InventoryPage() {
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

  const { data: inventory, error } = await adminSupabase
    .from("inventory")
    .select("*")
    .order("edition", { ascending: true });

  if (error) {
    throw new Error(
  "Could not load inventory: " + error?.message
);
  }

  const totalStock = inventory.reduce(
    (sum, item) => sum + item.stock_quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#090806] p-6 text-[#f2dfbd] md:p-10">
      <div className="mx-auto max-w-6xl">
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

          <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl">
            Inventory Management
          </h1>

          <p className="mt-2 text-sm text-[#bfb19d]">
            Manage your four book editions and available stock.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-[#bd9145]/30 bg-[#17130e] p-6">
          <p className="text-sm text-[#bfb19d]">
            Total Available Printed Copies
          </p>

          <p className="mt-3 text-4xl text-[#e8bd65]">
            {totalStock.toLocaleString()}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[#bd9145]/30 bg-[#17130e] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg text-[#e8bd65]">
                    {item.edition}
                  </h2>

                  <p className="mt-2 text-xs text-[#8f806b]">
                    Last updated:{" "}
                    {new Date(item.updated_at).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl text-[#f2dfbd]">
                    {item.stock_quantity.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#bfb19d]">
                    Copies available
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
