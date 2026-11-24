import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      return NextResponse.json(
        { error: "Server configuration is missing." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase
      .from("resellers")
      .select("commission_rate")
      .eq("email", email)
      .eq("is_approved", true)
      .maybeSingle();

    if (error) {
      console.error("Reseller check error:", error.message);

      return NextResponse.json(
        { error: "Could not check reseller status." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      approved: !!data,
      commissionRate: data?.commission_rate ?? 0,
    });
  } catch (error) {
    console.error("Reseller check API error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}