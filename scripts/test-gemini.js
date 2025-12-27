
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function testModels() {
    // 1. Load API Key securely
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        try {
            const envPath = path.resolve(process.cwd(), '.env.local');
            if (fs.existsSync(envPath)) {
                const content = fs.readFileSync(envPath, 'utf8');
                const match = content.match(/GEMINI_API_KEY=["']?([^"'\n]+)["']?/);
                if (match) apiKey = match[1];
            }
        } catch (e) {
            console.error("Failed to read .env.local");
        }
    }

    if (!apiKey) {
        console.error("CRITICAL: Could not find GEMINI_API_KEY.");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const candidates = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-latest",
        "gemini-1.0-pro",
        "gemini-pro",
        "gemini-1.5-pro"
    ];

    console.log(`Testing ${candidates.length} models...`);

    for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            await model.generateContent("Test"); // Simple generation
            console.log("✅ SUCCESS");
            console.log(`\n!!! FOUND WORKING MODEL: ${modelName} !!!\n`);
            return; // Stop after finding the best one
        } catch (e) {
            if (e.message.includes('404') || e.message.includes('Not Found')) {
                console.log("❌ 404 (Not Found)");
            } else {
                console.log(`❌ Error: ${e.message.split('\n')[0]}`);
            }
        }
    }
    console.log("No working models found.");
}

testModels();
