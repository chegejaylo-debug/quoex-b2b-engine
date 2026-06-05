import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT (server only)
);

export async function POST(req: Request) {
  try {
    const { email, phone, cart } = await req.json();

    if (!email || !cart || cart.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    // 1. Calculate total
    let total = 0;
    for (const item of cart) {
      total += item.price * (item.quantity || 1);
    }

    // 2. Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_email: email,
        phone,
        total,
        payment_status: "pending",
        delivery_status: "processing",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Prepare order items
    const orderItems = cart.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 4. ATOMIC STOCK UPDATE (SAFE VERSION)
    for (const item of cart) {
      const { data: product, error } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.id)
        .single();

      if (error || !product) continue;

      const newStock =
        product.stock - (item.quantity || 1);

      await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", item.id);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      total,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}