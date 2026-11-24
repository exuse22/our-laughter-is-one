
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

const allowedEditions = [
  "English Edition",
  "Amharic Edition",
  "Afaan Oromoo Edition",
  "Combined Multilingual Edition",
];

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (
      !user ||
      user.email?.toLowerCase() !==
        process.env.ADMIN_EMAIL?.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { edition, stockQuantity } = body;

    if (
      !allowedEditions.includes(edition) ||
      !Number.isSafeInteger(stockQuantity) ||
      stockQuantity < 0
    ) {
      return NextResponse.json(
        { error: "Invalid inventory information." },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    const { data, error } = await adminSupabase
      .from("inventory")
      .update({
        stock_quantity: stockQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("edition", edition)
      .select("edition, stock_quantity, updated_at")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Could not update inventory." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      inventory: data,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
