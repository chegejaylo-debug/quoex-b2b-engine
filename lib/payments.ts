import Stripe from 'stripe';
import paypal from 'paypal-rest-sdk';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID!,
  client_secret: process.env.PAYPAL_CLIENT_SECRET!,
});

export interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

// Stripe Payment Intent
export async function createStripePaymentIntent(details: PaymentDetails) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(details.amount * 100), // Convert to cents
      currency: details.currency.toLowerCase(),
      description: details.description,
      metadata: details.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return { success: true, clientSecret: paymentIntent.client_secret, id: paymentIntent.id };
  } catch (error) {
    console.error('Stripe error:', error);
    return { success: false, error: 'Failed to create Stripe payment intent' };
  }
}

// PayPal Payment
export async function createPayPalPayment(details: PaymentDetails) {
  const paymentJson = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paypal/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paypal/cancel`,
    },
    transactions: [
      {
        amount: {
          total: details.amount.toFixed(2),
          currency: details.currency.toUpperCase(),
        },
        description: details.description,
      },
    ],
  };

  try {
    const payment = await new Promise((resolve, reject) => {
      paypal.payment.create(paymentJson, (error, payment) => {
        if (error) reject(error);
        else resolve(payment);
      });
    });
    return { success: true, payment };
  } catch (error) {
    console.error('PayPal error:', error);
    return { success: false, error: 'Failed to create PayPal payment' };
  }
}

// M-Pesa Payment (using Intasend which is already in dependencies)
export async function createMpesaPayment(details: PaymentDetails, phoneNumber: string) {
  const Intasend = require('intasend-node');
  const intasend = new Intasend(
    process.env.INTASEND_PUBLIC_KEY!,
    process.env.INTASEND_SECRET_KEY!,
    true // test mode
  );

  try {
    const response = await intasend.collection.mpesa({
      amount: details.amount,
      currency: details.currency,
      phone_number: phoneNumber,
      remarks: details.description,
    });
    return { success: true, response };
  } catch (error) {
    console.error('M-Pesa error:', error);
    return { success: false, error: 'Failed to create M-Pesa payment' };
  }
}

// Verify payment status
export async function verifyPayment(paymentId: string, provider: 'stripe' | 'paypal') {
  if (provider === 'stripe') {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      return { success: true, status: paymentIntent.status };
    } catch (error) {
      return { success: false, error: 'Failed to verify Stripe payment' };
    }
  } else if (provider === 'paypal') {
    try {
      const payment = await new Promise((resolve, reject) => {
        paypal.payment.get(paymentId, (error, payment) => {
          if (error) reject(error);
          else resolve(payment);
        });
      });
      return { success: true, payment };
    } catch (error) {
      return { success: false, error: 'Failed to verify PayPal payment' };
    }
  }
  return { success: false, error: 'Invalid payment provider' };
}
