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

            // 2. Auto-reply to User
            await resend.emails.send({
                from: 'Vaibhav Chaudhary <onboarding@resend.dev>',
                to: email,
                subject: `Thanks for reaching out! 🚀`,
                html: `
                    <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #000;">Hi there,</h2>
                        <p>Got a question, an idea, or something you’d like to share?</p>
                        <p>I genuinely enjoy hearing from people — whether it’s feedback, collaboration ideas, support questions, or just a quick hello. Every message is personally read and replied to.</p>
                        
                        <h3 style="margin-top: 30px;">🚀 How to reach me</h3>
                        <p>You can simply reply to this email, and I’ll get back to you as soon as possible.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://vaibhav-14ry.vercel.app/#contact" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">👉 Send a Message</a>
                        </div>
                        
                        <h3>✨ Why send a message?</h3>
                        <ul style="padding-left: 20px;">
                            <li>Ask questions or get quick support</li>
                            <li>Share feedback or suggestions</li>
                            <li>Discuss collaborations or opportunities</li>
                            <li>Connect directly with me (no bots)</li>
                        </ul>
                        
                        <p style="margin-top: 30px;">Looking forward to hearing from you,</p>
                        <p><strong>Vaibhav Chaudhary</strong><br>The Vaibhav Chaudhary Team</p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px 0;">
                        
                        <p style="font-size: 12px; color: #999; text-align: center;">
                            🔒 Your information is always safe and never shared.<br>
                            🌐 <a href="https://vaibhav-14ry.vercel.app" style="color: #999;">https://vaibhav-14ry.vercel.app</a><br>
                            📩 14vaibhav2002@gmail.com
                        </p>
                    </div>
                `
            });
        } else {
            console.log("Mock Email Sent:", { name, email, message });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
