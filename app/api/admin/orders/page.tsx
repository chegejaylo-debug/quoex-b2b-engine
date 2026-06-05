"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
    }

    loadOrders();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Orders Dashboard
      </h1>

      {orders.map(order => (
        <div
          key={order.id}
          className="border p-4 mb-4 rounded"
        >
          <p>Email: {order.user_email}</p>
          <p>Total: KES {order.total}</p>
          <p>Payment: {order.payment_status}</p>
          <p>Delivery: {order.delivery_status}</p>
        </div>
      ))}
    </div>
  );
}