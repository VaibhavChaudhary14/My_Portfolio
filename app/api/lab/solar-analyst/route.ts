import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { latitude, declination, hourAngle, altitude, zenithAngle, incidentAngle, mode = "student" } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { analysis: "Error: GEMINI_API_KEY is not configured on the server." },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let systemInstruction = "";

        switch (mode) {
            case "child":
                systemInstruction = `
                    You are a fun, enthusiastic science teacher explaining things to a 12-year-old.
                    Use emojis, simple analogies, and a friendly tone. 
                    Explain why the shadows are long or short, and if it's hot or cold.
                    Avoid heavy math. Focus on the "feeling" of the sun.
                `;
                break;
            case "researcher":
                systemInstruction = `
                    You are a Solar Energy Engineer writing a technical field report.
                    Be extremely concise, professional, and data-driven.
                    Focus on:
                    1. Air Mass Effect (AM values if relevant).
                    2. Cosine losses due to incidence angle.
                    3. Estimated PV efficiency impact.
                    No fluff. Use bullet points.
                `;
                break;
            case "student":
            default:
                systemInstruction = `
                    You are a Physics Professor helping a university student.
                    Use proper terminology (Lambert's Cosine Law, Air Mass, Zenith).
                    Briefly mention the mathematical relationship (e.g., Intensity ~ sin(Altitude)).
                    Explain the physical implications for energy density.
                `;
                break;
        }

        const prompt = `
        ${systemInstruction}
        
        Current Simulation State:
        - Latitude: ${latitude.toFixed(1)}°
        - Solar Declination: ${declination.toFixed(1)}°
        - Hour Angle: ${hourAngle.toFixed(1)}°
        - Solar Altitude: ${altitude.toFixed(1)}°
        - Zenith Angle: ${zenithAngle.toFixed(1)}°
        
        Provide a response appropriate for your persona. Keep it under 150 words.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ analysis: text });

    } catch (error) {
        console.error("Solar Analysis Error:", error);
        return NextResponse.json(
            { analysis: "Failed to generate analysis. Please try again." },
            { status: 500 }
        );
    }
}
