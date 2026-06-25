import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = body.Body.stkCallback;

    const orderId = result.AccountReference;
    const status =
      result.ResultCode === 0 ? "paid" : "failed";

    // update order
    await supabase
      .from("orders")
      .update({
        payment_status: status,
      })
      .eq("id", orderId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}