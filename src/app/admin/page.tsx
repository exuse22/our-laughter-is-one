import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import OrdersTable from "./orders-table";
import { Suspense } from "react";
import { connection } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
export const instant = false;
async function AdminDashboardContent() {
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

 const { data: orders, error: ordersError } = await adminSupabase
   .from("orders")
   .select("*")
   .order("created_at", { ascending: false });

 if (ordersError) {
   throw new Error("Could not load customer orders.");
 }

 const totalOrders = orders.length;

 const totalRevenue = orders
   .filter((order) => order.payment_status === "paid")
   .reduce((sum, order) => sum + Number(order.price_etb), 0);

 const pendingOrders = orders.filter(
   (order) => order.order_status === "pending"
 ).length;
const salesOverview = Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - (6 - index));

  const dateKey = date.toISOString().slice(0, 10);

  const revenue = orders
    .filter(
      (order) =>
        order.payment_status === "paid" &&
        String(order.created_at).slice(0, 10) === dateKey
    )
    .reduce((sum, order) => sum + Number(order.price_etb), 0);

  return {
    label: date.toLocaleDateString("en", {
      weekday: "short",
      timeZone: "UTC",
    }),
    revenue,
  };
});

const maxDailyRevenue = Math.max(
  ...salesOverview.map((day) => day.revenue),
  1
);
 const totalCustomers = new Set(
   orders.map((order) => order.email.toLowerCase())
 ).size;

  return (
    <main className="min-h-screen bg-[#090806] text-[#f2dfbd]">
      <div className="flex min-h-screen">

        <aside className="hidden w-64 border-r border-[#bd9145]/30 bg-[#100d09] p-6 md:block">
          <h2 className="font-[var(--font-cormorant)] text-2xl text-[#e8bd65]">
            OUR LAUGHTER
          </h2>
          <p className="mt-1 text-xs tracking-[0.3em] text-[#bfb19d]">
            ADMIN PANEL
          </p>

         <nav className="mt-12 space-y-5 text-sm">
  <Link href="/admin" className="block text-[#e8bd65] hover:text-white">
    Dashboard
  </Link>

  <Link href="/admin/orders" className="block text-[#bfb19d] hover:text-[#e8bd65]">
    Orders
  </Link>

  <Link href="/admin/customers" className="block text-[#bfb19d] hover:text-[#e8bd65]">
    Customers
  </Link>

  <Link href="/admin/books" className="block text-[#bfb19d] hover:text-[#e8bd65]">
    Books & Editions
  </Link>

  <Link href="/admin/inventory" className="block text-[#bfb19d] hover:text-[#e8bd65]">
    Inventory
  </Link>

  <Link href="/admin/reports" className="block text-[#bfb19d] hover:text-[#e8bd65]">
    Reports
  </Link>

  <Link href="/admin/settings" className="block text-[#bfb19d] hover:text-[#e8bd65]">
    Settings
  </Link>
</nav>
        </aside>

        <section className="min-w-0 flex-1 p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.3em] text-[#d9ad5c]">
                MANAGEMENT
              </p>
              <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-[#bfb19d]">
                Welcome to your bookstore control center.
              </p>
            </div>

            <span className="rounded border border-[#bd9145]/50 px-4 py-2 text-xs text-[#e8bd65]">
              ADMIN
            </span>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              "Total Orders",
              "Total Revenue",
              "Pending Orders",
              "Total Customers",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[#bd9145]/30 bg-[#17130e] p-6"
              >
                <p className="text-sm text-[#bfb19d]">{item}</p>
               <p className="mt-5 text-3xl text-[#e8bd65]">
  {item === "Total Orders"
    ? totalOrders
    : item === "Total Revenue"
    ? `${totalRevenue.toLocaleString()} ETB`
    : item === "Pending Orders"
    ? pendingOrders
    : totalCustomers}
</p>
                <p className="mt-2 text-xs text-[#8f806b]">
                 Live database statistics
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-[#bd9145]/30 bg-[#17130e] p-6">
            <h2 className="text-xl text-[#e8bd65]">
              Recent Orders
            </h2>
            <div className="mt-10 rounded-xl border border-[#bd9145]/30 bg-[#17130e] p-6">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="text-xl text-[#e8bd65]">
        Sales Overview
      </h2>
      <p className="mt-2 text-sm text-[#bfb19d]">
        Paid revenue over the last 7 days
      </p>
    </div>

    <span className="text-xs text-[#d9ad5c]">
      LAST 7 DAYS
    </span>
  </div>

  <div className="mt-8 space-y-5">
    {salesOverview.map((day) => (
      <div key={day.label}>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-[#bfb19d]">
            {day.label}
          </span>
          <span className="text-[#e8bd65]">
            {day.revenue.toLocaleString()} ETB
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-[#090806]">
          <div
            className="h-full rounded-full bg-[#c99b42] transition-all"
            style={{
              width: `${(day.revenue / maxDailyRevenue) * 100}%`,
            }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
          <div className="mt-6">
  <OrdersTable initialOrders={orders} />
</div>
</div>
          <p className="mt-8 text-center text-xs text-[#8f806b]">
            OUR LAUGHTER IS ONE • ADMINISTRATION
          </p>
        </section>
      </div>
    </main>
  );
}
export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090806] p-10 text-[#d9ad5c]">
          Loading Admin Dashboard...
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
