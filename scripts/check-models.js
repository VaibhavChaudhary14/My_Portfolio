
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Simple .env.local parser since we can't assume dotenv is installed
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            content.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    process.env[match[1].trim()] = match[2].trim();
                }
            });
        }
    } catch (e) {
        console.error("Could not load .env.local", e);
    }
}

async function listModels() {
    loadEnv();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY not found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // We use the model manager to list models
        // Note: genAI.getModelManager() might be needed or just listModels on the class depending on version
        // In 0.1.0+ it's different. trying generic fetch if SDK doesn't verify.
        // Actually the SDK has a listModels method usually on the GoogleAIFileManager or similar? 
        // No, usually it is NOT in the main default export easily for client SDK.

        // Let's try to just run a generation with correct error handling
        console.log("Testing gemini-1.5-flash...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("Hello");
            console.log("Success with gemini-1.5-flash!");
        } catch (e) {
            console.log("gemini-1.5-flash failed:", e.message);
        }

        console.log("Testing gemini-pro...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Hello");
            console.log("Success with gemini-pro!");
        } catch (e) {
            console.log("gemini-pro failed:", e.message);
        }

    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

listModels();
