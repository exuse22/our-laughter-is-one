
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";
import { createOrderEmail } from "@/lib/order-email";

const allowedStatuses = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];
const allowedPaymentStatuses = [
  "pending",
  "paid",
  "failed",
];
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;
  const body = await request.json();
const { order_status, payment_status } = body;

if (
  order_status !== undefined &&
  !allowedStatuses.includes(order_status)
) {
  return NextResponse.json(
    { error: "Invalid order status" },
    { status: 400 }
  );
}

if (
  payment_status !== undefined &&
  !allowedPaymentStatuses.includes(payment_status)
) {
  return NextResponse.json(
    { error: "Invalid payment status" },
    { status: 400 }
  );
}

if (
  order_status === undefined &&
  payment_status === undefined
) {
  return NextResponse.json(
    { error: "No update provided" },
    { status: 400 }
  );
}

  const adminSupabase = createAdminClient();

  const { data: order, error: fetchError } =
    await adminSupabase
      .from("orders")
      .select(
        "id, customer_name, email, order_reference, edition, format, price_etb, order_status"
      )
      .eq("id", id)
      .maybeSingle();

  if (fetchError || !order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  const oldStatus = order.order_status;

  const updates: {
  order_status?: string;
  payment_status?: string;
} = {};

if (order_status !== undefined) {
  updates.order_status = order_status;
}

if (payment_status !== undefined) {
  updates.payment_status = payment_status;
}

const { error } = await adminSupabase
  .from("orders")
  .update(updates)
  .eq("id", id);

 if (error) {
  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  );
}

  let emailSent = false;

  if (
  order_status !== undefined &&
  oldStatus !== order_status &&
  process.env.RESEND_FROM_EMAIL
) {
    try {
      const email = createOrderEmail({
        customerName: order.customer_name,
        orderReference: order.order_reference,
        edition: order.edition,
        format: order.format,
        priceETB: Number(order.price_etb),
        status: order_status,
      });

      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: order.email,
        subject: email.subject,
        html: email.html,
      });

      emailSent = !result.error;
    } catch {
      emailSent = false;
    }
  }

  return NextResponse.json({
    success: true,
    emailSent,
  });
}