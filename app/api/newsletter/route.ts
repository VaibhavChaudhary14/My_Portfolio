import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

export async function POST(request: Request) {
    const { email } = await request.json();

    try {
        if (process.env.RESEND_API_KEY) {
            // 1. Notify Admin
            await resend.emails.send({
                from: 'Portfolio <onboarding@resend.dev>',
                to: '14vaibhav2002@gmail.com',
                subject: `New Newsletter Subscriber`,
                html: `<p><strong>Email:</strong> ${email} has joined the stash.</p>`
            });

            // 2. Welcome Email to User (Optional, could be set up in Resend Audiences)
            await resend.emails.send({
                from: 'Vaibhav <onboarding@resend.dev>',
                to: email,
                subject: `Welcome to the Stash 📦`,
                html: `<p>Hey! Thanks for subscribing. I'll keep you posted.</p>`
            });
        } else {
            console.log("Mock Subscription:", { email });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
