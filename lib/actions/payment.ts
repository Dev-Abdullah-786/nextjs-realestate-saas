"use server";
import Stripe from "stripe";

export const createPaymentIntent = async (
  amount: number,
  description: string,
) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    description,
    currency: "usd",
  });
  return paymentIntent;
};
