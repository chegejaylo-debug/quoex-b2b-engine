import Stripe from 'stripe';
import paypal from 'paypal-rest-sdk';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }

  return new Stripe(key, {
    apiVersion: '2025-02-24.acacia',
  });
}

function configurePayPal() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials');
  }

  paypal.configure({
    mode: process.env.PAYPAL_MODE || 'sandbox',
    client_id: clientId,
    client_secret: clientSecret,
  });
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}


export async function createStripePaymentIntent(details: PaymentDetails) {
  try {
    const stripe = getStripe();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(details.amount * 100),
      currency: details.currency.toLowerCase(),
      description: details.description,
      metadata: details.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };

  } catch (error) {
    console.error('Stripe error:', error);
    return {
      success: false,
      error: 'Failed to create Stripe payment intent'
    };
  }
}


export async function createPayPalPayment(details: PaymentDetails) {

  configurePayPal();

  const paymentJson = {
    intent: 'sale',

    payer: {
      payment_method: 'paypal',
    },

    redirect_urls: {
      return_url:
        `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paypal/success`,

      cancel_url:
        `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paypal/cancel`,
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


    return {
      success: true,
      payment
    };


  } catch (error) {

    console.error('PayPal error:', error);

    return {
      success:false,
      error:'Failed to create PayPal payment'
    };
  }
}



export async function createMpesaPayment(
  details: PaymentDetails,
  phoneNumber:string
){

  const Intasend = require('intasend-node');


  const intasend = new Intasend(
    process.env.INTASEND_PUBLIC_KEY!,
    process.env.INTASEND_SECRET_KEY!,
    true
  );


  try {

    const response =
      await intasend.collection.mpesa({

        amount: details.amount,

        currency: details.currency,

        phone_number: phoneNumber,

        remarks: details.description,

      });


    return {
      success:true,
      response
    };


  } catch(error){

    console.error('M-Pesa error:',error);

    return {
      success:false,
      error:'Failed to create M-Pesa payment'
    };
  }
}



export async function verifyPayment(
  paymentId:string,
  provider:'stripe'|'paypal'
){

  if(provider === 'stripe'){

    try {

      const stripe = getStripe();

      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentId);


      return {
        success:true,
        status:paymentIntent.status
      };


    }catch(error){

      return {
        success:false,
        error:'Failed to verify Stripe payment'
      };
    }

  }


  if(provider === 'paypal'){

    configurePayPal();


    try {

      const payment = await new Promise((resolve,reject)=>{

        paypal.payment.get(paymentId,(error,payment)=>{

          if(error) reject(error);

          else resolve(payment);

        });

      });


      return {
        success:true,
        payment
      };


    }catch(error){

      return {
        success:false,
        error:'Failed to verify PayPal payment'
      };

    }

  }


  return {
    success:false,
    error:'Invalid payment provider'
  };

}