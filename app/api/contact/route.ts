import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789"); // Mock key for dev

export async function POST(request: Request) {
    const { name, email, message } = await request.json();

    try {
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Portfolio <onboarding@resend.dev>',
                to: '14vaibhav2002@gmail.com',
                subject: `New Message from ${name}`,
                html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
            });
        } else {
            console.log("Mock Email Sent:", { name, email, message });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
