
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      email,
      phone,
      country,
      edition,
      format,
      paymentMethod,
      deliveryAddress,
      deliveryCity,
      quantity,
    } = body;

    if (
      !customerName ||
      !/^[\p{L}\p{M}\s'-]+$/u.test(String(customerName).trim()) ||
      !email ||
      !phone ||
      !country ||
      !edition ||
      !format ||
      !paymentMethod
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (
      !Number.isSafeInteger(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json(
        { error: "Please enter a valid quantity." },
        { status: 400 }
      );
    }

    const allowedEditions = [
      "English Edition",
      "Amharic Edition",
      "Afaan Oromoo Edition",
      "Combined Multilingual Edition",
    ];

    const allowedFormats = ["Printed Book", "Digital Book"];

    const allowedPayments = [
      "Telebirr",
      "CBE Birr",
      "M-PESA Ethiopia",
      "Kacha",
      "Amole",
      "HelloCash",
      "Bank Transfer",
      "Visa/Mastercard",
      "PayPal",
    ];

    if (
      !allowedEditions.includes(edition) ||
      !allowedFormats.includes(format) ||
      !allowedPayments.includes(paymentMethod)
    ) {
      return NextResponse.json(
        { error: "Invalid order information." },
        { status: 400 }
      );
    }

    if (
      format === "Printed Book" &&
      (!deliveryAddress || !deliveryCity)
    ) {
      return NextResponse.json(
        { error: "Delivery address is required for printed books." },
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

    // Check available printed stock
    if (format === "Printed Book") {
      const { data: stock, error: stockError } = await supabase
        .from("inventory")
        .select("stock_quantity")
        .eq("edition", edition)
        .single();

      if (stockError || !stock) {
        return NextResponse.json(
          { error: "Could not check available stock." },
          { status: 500 }
        );
      }

      if (stock.stock_quantity < quantity) {
        return NextResponse.json(
          {
            error: `Only ${stock.stock_quantity} copies are currently available.`,
          },
          { status: 400 }
        );
      }
    }

    const unitPrice = 1000;
    const totalPrice = unitPrice * quantity;

    if (!Number.isSafeInteger(totalPrice)) {
      return NextResponse.json(
        { error: "The order total is too large." },
        { status: 400 }
      );
    }

    // Check whether this customer is an approved reseller
    let resellerId: string | null = null;
    let commissionRate = 0;

    if (format === "Printed Book") {
      const { data: reseller, error: resellerError } = await supabase
        .from("resellers")
        .select("id, commission_rate")
        .eq("email", String(email).trim().toLowerCase())
        .eq("is_approved", true)
        .maybeSingle();

      if (resellerError) {
        console.error("Reseller lookup error:", resellerError.message);

        return NextResponse.json(
          { error: "Could not verify reseller approval." },
          { status: 500 }
        );
      }

      if (reseller) {
        resellerId = reseller.id;
        commissionRate = reseller.commission_rate;
      }
    }

    const orderReference =
      "OLIO-" +
      Date.now().toString().slice(-8) +
      "-" +
      crypto.randomUUID().slice(0, 6).toUpperCase();

    const { error } = await supabase.from("orders").insert({
      order_reference: orderReference,
      customer_name: String(customerName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      country: String(country).trim(),
      edition,
      format,
      quantity,
      price_etb: totalPrice,
      reseller_id: resellerId,
      commission_rate: commissionRate,
      commission_etb: 0,
      owner_amount_etb: 0,
      payment_method: paymentMethod,
      payment_status: "pending",
      delivery_address:
        format === "Printed Book"
          ? String(deliveryAddress).trim()
          : null,
      delivery_city:
        format === "Printed Book"
          ? String(deliveryCity).trim()
          : null,
      order_status: "pending",
    });

    if (error) {
      console.error("Order save error:", error.message);

      return NextResponse.json(
        { error: "We could not save your order. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        orderReference,
        quantity,
        totalPrice,
        commissionRate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order API error:", error);

    return NextResponse.json(
      { error: "Invalid request. Please try again." },
      { status: 400 }
    );
  }
}
