
"use client";

import { useState } from "react";

type InventoryItem = {
  id: string;
  edition: string;
  stock_quantity: number;
  updated_at: string;
};

export default function InventoryEditor({
  initialInventory,
}: {
  initialInventory: InventoryItem[];
}) {
  const [inventory, setInventory] = useState(initialInventory);

  const [quantities, setQuantities] = useState<
    Record<string, string>
  >(
    Object.fromEntries(
      initialInventory.map((item) => [
        item.edition,
        String(item.stock_quantity),
      ])
    )
  );

  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const totalStock = inventory.reduce(
    (sum, item) => sum + item.stock_quantity,
    0
  );

  async function saveStock(edition: string) {
    const quantity = Number(quantities[edition]);

    if (
      quantities[edition].trim() === "" ||
      !Number.isSafeInteger(quantity) ||
      quantity < 0
    ) {
      setMessage("Please enter a valid stock quantity.");
      return;
    }

    setSaving(edition);
    setMessage("");

    try {
      const response = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edition,
          stockQuantity: quantity,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Could not update stock.");
        return;
      }

      setInventory((current) =>
        current.map((item) =>
          item.edition === edition
            ? {
                ...item,
                stock_quantity: result.inventory.stock_quantity,
                updated_at: result.inventory.updated_at,
              }
            : item
        )
      );

      setMessage(`${edition} stock updated successfully!`);
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <>
      <div className="mt-8 rounded-xl border border-[#bd9145]/30 bg-[#17130e] p-6">
        <p className="text-sm text-[#bfb19d]">
          Total Available Printed Copies
        </p>

        <p className="mt-3 text-4xl text-[#e8bd65]">
          {totalStock.toLocaleString()}
        </p>
      </div>

      {message && (
        <p className="mt-5 rounded-lg border border-[#bd9145]/30 p-4 text-sm text-[#e8bd65]">
          {message}
        </p>
      )}

      <div className="mt-8 space-y-4">
        {inventory.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-[#bd9145]/30 bg-[#17130e] p-6"
          >
            <h2 className="text-lg text-[#e8bd65]">
              {item.edition}
            </h2>

            <p className="mt-2 text-xs text-[#8f806b]">
              Last updated:{" "}
              {new Date(item.updated_at).toLocaleString()}
            </p>

            <div className="mt-5 flex flex-wrap items-end gap-3">
              <div className="flex-1">
                <label className="mb-2 block text-xs text-[#bfb19d]">
                  Available copies
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={quantities[item.edition]}
                  onChange={(event) =>
                    setQuantities((current) => ({
                      ...current,
                      [item.edition]: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[#bd9145]/40 bg-[#090806] px-4 py-3 text-[#f2dfbd] outline-none focus:border-[#e8bd65]"
                />
              </div>

              <button
                onClick={() => saveStock(item.edition)}
                disabled={saving !== null}
                className="rounded-lg bg-[#bd9145] px-6 py-3 text-sm font-semibold text-[#090806] transition hover:bg-[#e8bd65] disabled:opacity-50"
              >
                {saving === item.edition ? "Saving..." : "Save Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
