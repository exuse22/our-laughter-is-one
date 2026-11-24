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

// GET: Load all resellers
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("resellers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Reseller loading error:", error.message);

      return NextResponse.json(
        { error: "Could not load resellers." },
        { status: 500 }
      );
    }

    return NextResponse.json({ resellers: data });
  } catch (error) {
    console.error("Reseller GET error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// POST: Add a new reseller
export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const customerName = String(body.customerName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const commissionRate = Number(body.commissionRate);

    if (
      !customerName ||
      !/^[\p{L}\p{M}\s'-]+$/u.test(customerName) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      ![15, 20, 30].includes(commissionRate)
    ) {
      return NextResponse.json(
        { error: "Please enter valid reseller information." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("resellers")
      .insert({
        customer_name: customerName,
        email,
        commission_rate: commissionRate,
        is_approved: false,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Reseller creation error:", error.message);

      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email is already registered as a reseller." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Could not add reseller." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reseller: data }, { status: 201 });
  } catch (error) {
    console.error("Reseller POST error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}