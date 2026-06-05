"use client";

import { useEffect, useState } from "react";

export default function PaymentButton({
  amount,
  email,
}: {
  amount: number;
  email: string;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // load SDK only in browser
    import("intasend-inlinejs-sdk").then(() => {
      setLoaded(true);
    });
  }, []);

  const handlePayment = () => {
    if (!loaded) return;

    // @ts-ignore
    const IntaSend = (window as any).IntaSend;

    const intasend = new IntaSend({
      publicAPIKey: process.env.NEXT_PUBLIC_INTASEND_KEY,
      live: false,
    });

    intasend
      .checkout({
        amount,
        currency: "KES",
        email,
      })
      .then((resp: any) => {
        console.log("Payment success:", resp);
      })
      .catch((err: any) => {
        console.log("Payment failed:", err);
      });
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-orange-600 py-4 rounded-xl font-bold"
    >
      Pay KES {amount}
    </button>
  );
}