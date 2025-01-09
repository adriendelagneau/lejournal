import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req: NextRequest) => {
    const body = await req.json() as Stripe.Event

    switch (body.type) {
        case "checkout.session.completed": {
            const session = body.data.object as Stripe.Checkout.Session
            const stripeCustomerId = session.customer
            const user = await findUserFromCustomer(stripeCustomerId)

            if (!user?.id)
                break
            await db.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    plan: "MASTER"
                }
            })

            console.log("Checkout session completed", session)
            break
        }
        case "invoice.paid": {
            const invoice = body.data.object as Stripe.Invoice

            const stripeCustomerId = invoice.customer
            const user = await findUserFromCustomer(stripeCustomerId)

            if (!user?.id)
                break
            await db.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    plan: "MASTER"
                }
            })

            console.log("Invoice event", body.type, invoice)
            break
        }
        case "invoice.payment_failed": {
            const invoice = body.data.object as Stripe.Invoice

            const stripeCustomerId = invoice.customer
            const user = await findUserFromCustomer(stripeCustomerId)

            if (!user?.id)
                break
            await db.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    plan: "FREE"
                }
            })
            console.log("Invoice event", body.type, invoice)
            break
        }
        case "customer.subscription.deleted": {
            const Subscription = body.data.object as Stripe.Subscription

            const stripeCustomerId = Subscription.customer
            const user = await findUserFromCustomer(stripeCustomerId)

            if (!user?.id)
                break
            await db.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    plan: "FREE"
                }
            })
            console.log("Subscription event", body.type, Subscription)
            break
        }
        default: {
            console.log("Unhandled event type", body.type)
        }
    }

    return NextResponse.json({ok: true})
}

export const findUserFromCustomer = async (stripeCustomerId: unknown) => {

    if (typeof stripeCustomerId !== "string") {
        return null
    }
    return db.user.findFirst({
        where: {
            stripeCustomerId
        },
    })
}