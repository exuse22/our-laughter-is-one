
"use client";

import { useState } from "react";

type Order = {
  id: string;
  order_reference: string;
  customer_name: string;
  edition: string;
  format: string;
  quantity: number;
  price_etb: number | string;
  order_status: string;
  payment_status: string;
  created_at: string;
};

type Change = {
  id: string;
  field: "order_status" | "payment_status";
  oldValue: string;
  newValue: string;
};

const statuses = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

const paymentStatuses = [
  "pending",
  "paid",
  "failed",
];

export default function OrdersTable({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  async function saveChange(
    id: string,
    field: Change["field"],
    value: string
  ) {
    if (savingId) return false;

    const order = orders.find((item) => item.id === id);
    if (!order) return false;

    const oldValue = order[field];

    if (oldValue === value) return false;

    setSavingId(id);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Update failed");
      }

      setOrders((previous) =>
        previous.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );

      setMessage(
        field === "order_status"
          ? "Order status updated successfully!"
          : "Payment status updated successfully!"
      );

      return true;
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      return false;
    } finally {
      setSavingId("");
    }
  }

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      order.order_reference.toLowerCase().includes(searchText) ||
      order.customer_name.toLowerCase().includes(searchText) ||
      order.edition.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || order.order_status === statusFilter;

    const matchesPayment =
      paymentFilter === "all" || order.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search order, customer or edition..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-lg border border-[#bd9145]/40 bg-[#090806] p-3 text-[#f2dfbd] outline-none focus:border-[#d9ad5c]"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-[#bd9145]/40 bg-[#090806] p-3 text-[#f2dfbd]"
        >
          <option value="all">All Order Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={paymentFilter}
          onChange={(event) => setPaymentFilter(event.target.value)}
          className="rounded-lg border border-[#bd9145]/40 bg-[#090806] p-3 text-[#f2dfbd]"
        >
          <option value="all">All Payment Statuses</option>
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#bfb19d]">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>

        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
            setPaymentFilter("all");
          }}
          className="rounded-lg border border-[#bd9145]/40 px-4 py-2 text-sm text-[#d9ad5c] hover:bg-[#bd9145]/10"
        >
          Clear Filters
        </button>
      </div>

      {message && (
        <p className="mb-4 text-sm text-[#d9ad5c]">
          {message}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="text-[#d9ad5c]">
            <tr className="border-b border-[#bd9145]/30">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Edition</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Total Price</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Order Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#8f806b]">
                  No matching orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  saving={savingId === order.id}
                  onSave={saveChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderRow({
  order,
  saving,
  onSave,
}: {
  order: Order;
  saving: boolean;
  onSave: (
    id: string,
    field: Change["field"],
    value: string
  ) => Promise<boolean>;
}) {
  const [status, setStatus] = useState(order.order_status);

  return (
    <tr className="border-b border-[#bd9145]/20">
      <td className="p-3">{order.order_reference}</td>

      <td className="p-3">{order.customer_name}</td>

      <td className="p-3">
        {order.edition} ({order.format})
      </td>

      <td className="p-3 font-semibold text-[#e8bd65]">
        {Number(order.quantity ?? 1).toLocaleString()} copies
      </td>

      <td className="p-3">
        {Number(order.price_etb).toLocaleString()} ETB
      </td>

      <td className="p-3">
        <div className="space-y-2">
          <span
            className={`block text-xs font-semibold ${
              order.payment_status === "paid"
                ? "text-green-400"
                : order.payment_status === "failed"
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {order.payment_status === "paid"
              ? "✓ Payment Verified"
              : order.payment_status === "failed"
              ? "✕ Payment Failed"
              : "◷ Awaiting Verification"}
          </span>

          <select
            value={order.payment_status}
            onChange={(event) =>
              void onSave(
                order.id,
                "payment_status",
                event.target.value
              )
            }
            disabled={saving}
            className="rounded border border-[#bd9145]/40 bg-[#17130d] p-2 text-[#f2dfbd]"
          >
            {paymentStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </td>

      <td className="p-3">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          disabled={saving}
          className="rounded border border-[#bd9145]/40 bg-[#17130d] p-2 text-[#f2dfbd]"
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </td>

      <td className="p-3">
        <button
          onClick={async () => {
            const success = await onSave(
              order.id,
              "order_status",
              status
            );

            if (!success) {
              setStatus(order.order_status);
            }
          }}
          disabled={saving || status === order.order_status}
          className="rounded bg-[#d9ad5c] px-4 py-2 text-black disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </td>
    </tr>
  );
}
