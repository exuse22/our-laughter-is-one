"use client";

import { useEffect, useState } from "react";

type Reseller = {
  id: string;
  customer_name: string;
  email: string;
  commission_rate: number;
  is_approved: boolean;
  created_at: string;
};

export default function ResellersManager() {
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [commissionRate, setCommissionRate] = useState("15");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadResellers() {
    try {
      const response = await fetch("/api/admin/resellers");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not load resellers.");
      }

      setResellers(result.resellers || []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load resellers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResellers();
  }, []);

  async function addReseller(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/resellers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          email,
          commissionRate: Number(commissionRate),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not add reseller.");
      }

      setCustomerName("");
      setEmail("");
      setCommissionRate("15");
      setMessage("Reseller added successfully. Approval is still required.");

      await loadResellers();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateReseller(
    id: string,
    changes: {
      isApproved?: boolean;
      commissionRate?: number;
    }
  ) {
    setMessage("");

    try {
      const response = await fetch(`/api/admin/resellers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not update reseller.");
      }

      setResellers((current) =>
        current.map((reseller) =>
          reseller.id === id ? result.reseller : reseller
        )
      );

      setMessage("Reseller updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Update failed."
      );
    }
  }

  const approvedCount = resellers.filter(
    (reseller) => reseller.is_approved
  ).length;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-10">
        <a
          href="/admin"
          className="text-sm text-[#c99b42] hover:text-[#f2dfbd]"
        >
          ← Back to Dashboard
        </a>

        <h1 className="mt-5 text-3xl font-semibold">
          Reseller Management
        </h1>

        <p className="mt-2 text-sm text-[#a99b83]">
          Add resellers, approve accounts and manage commission rates.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#3a3020] bg-[#12100c] p-6">
          <p className="text-sm text-[#a99b83]">Total Resellers</p>
          <p className="mt-2 text-3xl font-semibold">{resellers.length}</p>
        </div>

        <div className="rounded-2xl border border-[#3a3020] bg-[#12100c] p-6">
          <p className="text-sm text-[#a99b83]">Approved Resellers</p>
          <p className="mt-2 text-3xl font-semibold text-[#d9ad5c]">
            {approvedCount}
          </p>
        </div>
      </div>

      <section className="mb-10 rounded-2xl border border-[#3a3020] bg-[#12100c] p-6">
        <h2 className="mb-6 text-xl font-semibold">Add New Reseller</h2>

        <form onSubmit={addReseller} className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-[#c8b99f]">
              Customer Name
            </label>

            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              placeholder="Full name"
              className="w-full rounded-xl border border-[#443824] bg-[#090806] px-4 py-3 text-white outline-none focus:border-[#d9ad5c]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#c8b99f]">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="customer@example.com"
              className="w-full rounded-xl border border-[#443824] bg-[#090806] px-4 py-3 text-white outline-none focus:border-[#d9ad5c]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#c8b99f]">
              Commission Rate
            </label>

            <select
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full rounded-xl border border-[#443824] bg-[#090806] px-4 py-3 text-white outline-none focus:border-[#d9ad5c]"
            >
              <option value="15">15%</option>
              <option value="20">20%</option>
              <option value="30">30%</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-[#d9ad5c] px-5 py-3 font-semibold text-black transition hover:bg-[#edc77d] disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Reseller"}
            </button>
          </div>
        </form>
      </section>

      {message && (
        <div className="mb-6 rounded-xl border border-[#6b542d] bg-[#1b160d] p-4 text-sm text-[#e6c47f]">
          {message}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#3a3020] bg-[#12100c]">
        <div className="border-b border-[#3a3020] p-6">
          <h2 className="text-xl font-semibold">All Resellers</h2>
        </div>

        {loading ? (
          <p className="p-6 text-[#a99b83]">Loading resellers...</p>
        ) : resellers.length === 0 ? (
          <p className="p-6 text-[#a99b83]">No resellers added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-[#1b1811] text-[#c8b99f]">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Commission</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {resellers.map((reseller) => (
                  <tr
                    key={reseller.id}
                    className="border-t border-[#302719]"
                  >
                    <td className="p-4 font-medium">
                      {reseller.customer_name}
                    </td>

                    <td className="p-4 text-[#c8b99f]">
                      {reseller.email}
                    </td>

                    <td className="p-4">
                      <select
                        value={reseller.commission_rate}
                        onChange={(e) =>
                          updateReseller(reseller.id, {
                            commissionRate: Number(e.target.value),
                          })
                        }
                        className="rounded-lg border border-[#443824] bg-[#090806] px-3 py-2 text-white"
                      >
                        <option value="15">15%</option>
                        <option value="20">20%</option>
                        <option value="30">30%</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <span
                        className={
                          reseller.is_approved
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        {reseller.is_approved ? "Approved" : "Pending"}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
                          updateReseller(reseller.id, {
                            isApproved: !reseller.is_approved,
                          })
                        }
                        className="rounded-lg border border-[#6b542d] px-3 py-2 text-[#e6c47f] hover:bg-[#2b2112]"
                      >
                        {reseller.is_approved ? "Revoke" : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}