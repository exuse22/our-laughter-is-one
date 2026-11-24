import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

async function isAdmin() {
  const authSupabase = await createClient();

  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  return (
    !!user?.email &&
    !!adminEmail &&
    user.email.trim().toLowerCase() === adminEmail
  );
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updates: {
      is_approved?: boolean;
      commission_rate?: number;
    } = {};

    if (typeof body.isApproved === "boolean") {
      updates.is_approved = body.isApproved;
    }

    if (body.commissionRate !== undefined) {
      const rate = Number(body.commissionRate);

      if (![15, 20, 30].includes(rate)) {
        return NextResponse.json(
          { error: "Commission must be 15%, 20%, or 30%." },
          { status: 400 }
        );
      }

      updates.commission_rate = rate;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid changes were provided." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("resellers")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Reseller update error:", error.message);

      return NextResponse.json(
        { error: "Could not update reseller." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reseller: data });
  } catch (error) {
    console.error("Reseller PATCH error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}