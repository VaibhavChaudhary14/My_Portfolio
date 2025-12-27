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

            // 2. Welcome Email to User
            await resend.emails.send({
                from: 'Vaibhav Chaudhary <onboarding@resend.dev>',
                to: email,
                subject: `Welcome to the Newsletter! 🎁`,
                html: `
                    <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #000;">Hi there,</h2>
                        <p>Want to stay updated and never miss out?</p>
                        <p>My newsletter brings you insights, updates, learning resources, and exclusive content — straight to your inbox. Simple, valuable, and spam-free.</p>
                        
                        <h3 style="margin-top: 30px;">💡 What you’ll receive</h3>
                        <ul style="padding-left: 20px;">
                            <li>✔️ Project & portfolio updates</li>
                            <li>✔️ Tech insights and learnings</li>
                            <li>✔️ Exclusive tips & resources</li>
                            <li>✔️ Early access to new work and ideas</li>
                        </ul>
                        
                        <h3 style="margin-top: 30px;">📩 Join in one click</h3>
                        <p>You are already subscribed, but feel free to share the link below:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://vaibhav-14ry.vercel.app/#newsletter" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">👉 Subscribe to the Newsletter</a>
                        </div>
                        
                        <h3>🎁 Subscriber bonus</h3>
                        <p>New subscribers may receive exclusive content or early previews as a thank-you for joining.</p>
                        <p>You can unsubscribe anytime — just one click, no questions asked.</p>
                        
                        <p style="margin-top: 30px;">See you in your inbox,</p>
                        <p><strong>Vaibhav Chaudhary</strong><br>The Vaibhav Chaudhary Team</p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px 0;">
                        
                        <p style="font-size: 12px; color: #999; text-align: center;">
                            🌐 <a href="https://vaibhav-14ry.vercel.app" style="color: #999;">https://vaibhav-14ry.vercel.app</a><br>
                            ✉️ 14vaibhav2002@gmail.com
                        </p>
                    </div>
                `
            });
        } else {
            console.log("Mock Subscription:", { email });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
