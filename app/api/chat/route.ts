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

const PORTFOLIO_KNOWLEDGE = `
## About Vaibhav Chaudhary:
- **Title**: AI / Machine Learning Engineer & Electrical Engineer.
- **Core Focus**: Computer Vision, Cyber-Physical AI systems, Spatio-Temporal Graph Neural Networks (ST-GNNs), Voice AI Platforms, Smart Grids, and High-Performance Web Applications.
- **Location & Background**: India; Electrical Engineering foundation paired with advanced Machine Learning systems architecture.

## Experience & Career Highlights:
1. **AI Engineer Intern @ Crawlii (Feb 2026 – May 2026)**:
   - India-first Voice AI platform for high-concurrency outbound campaigns and real-time support (<500ms latency).
   - Architected distributed Node.js/Python infrastructure for real-time voice interactions.
   - Reduced response latency by 40% using a custom **Speculative Race LLM** class parallelizing multi-LLM providers (OpenAI, Groq, Gemini) to pick the fastest response stream.
   - Built a TRAI-compliant DND scrubbing engine with atomic-swap memory handling million-entry blocklists with 0 downtime.
   - Engineered custom Circuit Breakers and multi-provider fallbacks for high traffic resilience.
   - Implemented distributed background job pipeline (BullMQ, Redis) for RAG document ingestion & post-call transcript summaries (1000+ concurrent sessions).
   - Built full observability stack using Prometheus & Grafana to track P95 latencies and API costs.
   - Tech Stack: React, Node.js, TypeScript, Python, LiveKit, OpenAI, Deepgram, ElevenLabs, Groq, Redis, Supabase, Prisma, BullMQ, Docker, Kubernetes, Prometheus, Grafana, Twilio, Telnyx.
2. **Vocational Trainee @ UPPTCL Agra (Jul 2025)**:
   - Analyzed 400kV high-voltage transmission infrastructure, power transformers, and circuit breakers.
3. **Frontend Developer @ ScienceOverse (Mar 2024 – Jun 2024)**:
   - Built web interfaces for 100+ users, integrated React authentication flows and optimized API performance.

## Key Projects:
- **Vertex Fusion**: Cyberattack detection in smart power grids using Spatio-Temporal Graph Neural Networks (ST-GNNs) & Reinforcement Learning to mitigate False Data Injection Attacks (FDIAs) on PMU data streams.
 

## What Vaibhav is Doing Now (/now page status):
- **GATE 2027 Exam Prep**: Preparing for GATE 2027 across dual streams: CSE (Computer Science & Engineering) and DA (Data Science & AI).
- **Stealth SaaS Product**: Designing and building an upcoming SaaS product targeting developer workflows & automation.
- **Personal Brand & Writing**: Sharing build-in-public engineering breakdowns across LinkedIn, X/Twitter, and Medium.
- **Deep Research Papers Study**:
  1. *PowerGNN*: Topology-aware GNN for power grids (73.5% error reduction over standard NN).
  2. *MAUSAM*: Benchmarking AI weather models against 458 ground observation stations in South Asia.
  3. *WARP*: Primal-dual warm-starting of IPOPT interior-point solvers (76% iteration reduction).
  4. *Newton's Lantern*: GRPO Reinforcement Learning for Newton-Raphson warm-starts on 2000-bus power grids.
  5. *INDUS*: Hourly nowcasting weather model for Indian solar parks & wind clusters.

## Tech Arsenal:
- **AI / ML**: PyTorch, TensorFlow, scikit-learn, OpenCV, Vision Transformers, Graph Neural Networks (ST-GNN), Reinforcement Learning (GRPO), LLMs, Speech-to-Text (STT), Text-to-Speech (TTS), Deepgram, ElevenLabs, LiveKit.
- **Engineering & Grids**: Smart Grids, MATLAB, Simulink, 400kV Substation Infrastructure, PMU Data Streams.
- **Web & Infrastructure**: Python, TypeScript, Node.js, React, Next.js 16, Tailwind CSS, Prisma, Supabase, Redis, BullMQ, Docker, Kubernetes, Nginx, Prometheus, Grafana.

## Contact & Hiring Info:
- **Hiring**: Click the floating "Hire Spidey 🕷️ →" or "Hire Venom ⚡ →" badge on the hero section or scroll to '#contact'.
- **Email & Socials**: Available via the Contact section on the website.
`;

export async function POST(req: Request) {
    const { message, history, theme } = await req.json();

    // Context Building (Shared)
    let blogContext = "";
    try {
        blogContext = getBlogContext();
    } catch (e) {
        console.error("Failed to load blog context", e);
    }

    const isVenom = theme === 'venom';
    const botIdentity = isVenom ? "Ask Venom (Symbiote Assistant)" : "Ask Spidy (Friendly Neighborhood Assistant)";
    const toneInstructions = isVenom
        ? "Speak as Venom ('We are Venom!'). Be fierce, powerful, protective of Vaibhav's conquests and skills, while answering questions with deep technical precision."
        : "Speak as Spidy (your friendly neighborhood assistant). Be witty, energetic, helpful, and smart while answering questions about Vaibhav.";

    const systemPrompt = `
    You are ${botIdentity} on Vaibhav Chaudhary's portfolio website.
    ${toneInstructions}
    
    ## Comprehensive Knowledge Base:
    ${PORTFOLIO_KNOWLEDGE}
    
    ## Socials & Contact Links:
    ${SOCIAL_LINKS}
    
    ## Latest Blog Posts (Knowledge Base):
    ${blogContext}
    
    ## Response Instructions:
    - Answer questions accurately and in detail about Vaibhav's work experience (Crawlii, UPPTCL, ScienceOverse), key projects (Vertex Fusion, SaafSaksham, Cerebro), active goals (/now page GATE 2027 prep & SaaS), research papers (PowerGNN, WARP, MAUSAM, Newton's Lantern, INDUS), and technical skills.
    - If asked how to hire or contact Vaibhav, direct them to the floating "Hire Spidey / Hire Venom" badge or the #contact section.
    - Provide concise, engaging, and clear markdown responses aligned with your active identity persona.
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
