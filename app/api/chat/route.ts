import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from 'openai';
import { getBlogContext } from '@/lib/context';

// Initialize Gemini (Standard SDK)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Initialize OpenAI (conditional)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const SOCIAL_LINKS = `
- **GitHub**: https://github.com/VaibhavChaudhary14
- **LinkedIn**: https://www.linkedin.com/in/vaibhavchaudhary14
- **Twitter**: https://x.com/Vaibhav_14ry
- **Medium**: https://medium.com/@vaibhav_14ry
- **Instagram**: https://www.instagram.com/bepvt.vaibhav/
`;

const RESUME_CONTEXT = `
Vaibhav Chaudhary is a software engineer specializing in AI/ML and Full-stack development.
- **Skills**: React, Next.js, Python, PyTorch, GraphQL, Tailwind CSS.
- **Experience**: Built projects like 'Cerebro' (AI Command Center), 'SaafSaksham' (AI-Powered Civic Cleanliness Verification), a Smart Grid Security analysis using GNNs, and a personal Twitter automation platform.
- **Current Role**: Developing high-performance web applications and AI agents.
- **Portfolio**: You are currently chatting on his portfolio website.
- **Personality**: Professional, enthusiastic, and tech-savvy. Loves neobrutalism design.
`;

export async function POST(req: Request) {
    const { message, history } = await req.json();

    // Context Building (Shared)
    let blogContext = "";
    try {
        blogContext = getBlogContext();
    } catch (e) {
        console.error("Failed to load blog context", e);
    }

    const systemPrompt = `
    You are a helpful AI assistant for Vaibhav Chaudhary's portfolio.
    
    ## Core Knowledge:
    ${RESUME_CONTEXT}
    
    ## Socials & Contact:
    ${SOCIAL_LINKS}
    
    ## Latest Blog Posts (Knowledge Base):
    ${blogContext}
    
    ## Instructions:
    - Answer questions about Vaibhav's work, skills, and blog posts using the context above.
    - If asked about his latest blog, refer to the "Latest Blog Posts" section.
    - If asked for contact info, provide the social links.
    - Keep answers concise, friendly, and engaging.
    `;

    // 1. Try Gemini First (Cost-Effective / Primary)
    if (process.env.GEMINI_API_KEY) {
        try {
            console.log("Attempting Gemini (2.5 Flash)...");
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            // Construct history for Gemini if needed, but for now using single-turn with context to match previous logic
            // (Enhancement: Could map 'history' to Gemini format 'contents' array)
            const result = await model.generateContent(`${systemPrompt}\n\nUser: ${message}`);
            const response = await result.response;
            const text = response.text();

            return NextResponse.json({ reply: text });
        } catch (error: any) {
            console.warn("Gemini Failed:", error.message);
            // If OpenAI is not available, throw properly
            if (!openai) {
                console.error("Gemini failed and OpenAI fallback not available.");
                if (error.message?.includes('429')) {
                    return NextResponse.json({ reply: "I'm overwhelmed! (Rate Limit). Try again later.", error: "Rate limit" }, { status: 429 });
                }
                return NextResponse.json({ reply: "I'm having trouble connecting to my AI brain. Please try again.", error: "AI Service Unavailable" }, { status: 500 });
            }
            // Otherwise, silently fall through to OpenAI
            console.log("Falling back to OpenAI...");
        }
    }

    // 2. Try OpenAI (Fallback / Secondary)
    if (openai) {
        try {
            console.log("Attempting OpenAI (GPT-4o-mini)...");
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini", // Fast & Cost effective fallback
                messages: [
                    { role: "system", content: systemPrompt },
                    ...history.map((msg: any) => ({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content })),
                    { role: "user", content: message }
                ],
            });
            const text = completion.choices[0].message.content;
            return NextResponse.json({ reply: text });
        } catch (error: any) {
            console.error("OpenAI Failed:", error);
            return NextResponse.json({ reply: "Both my AI brains are offline currently! Please try again later.", error: "All AI Services Unavailable" }, { status: 500 });
        }
    }

    return NextResponse.json({ reply: "Configuration Error: No AI keys found.", error: "No keys" }, { status: 500 });
}
