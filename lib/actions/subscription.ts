"use server";
import prisma from "../prisma";

export const saveSubscription = async ({
  paymentId,
  planId,
  userId,
}: {
  paymentId: string;
  planId: number;
  userId: string;
}) => {
  try {
    await prisma.subscriptions.create({
      data: {
        paymentID: paymentId,
        user: {
          connect: {
            id: userId,
          },
        },
        plan: {
          connect: {
            id: planId,
          },
        },
      },
    });

    return {
      message: "Subscription Saved Successfully",
    };
  } catch (e: unknown) {
    let message = "Something went wrong";

    if (e instanceof Error) {
      message = e.message;
    }

    return {
      message,
    };
  }
};
