import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { paymentIntent } = await request.json();

    if (!paymentIntent) {
      throw new Error("paymentIntent required");
    }

    const verifyPaymentIntent =
      await stripe.paymentIntents.retrieve(paymentIntent);

    const paymentMethod = await stripe.paymentMethods.retrieve(
      verifyPaymentIntent.payment_method
    );

    return NextResponse.json(
      {
        paymentStatus: verifyPaymentIntent.status === "succeeded",
        billing_details: paymentMethod.billing_details,
      },
      { status: 200 }
    );
  } catch (error) {
    throw error;
  }
}
