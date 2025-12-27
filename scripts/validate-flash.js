
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Manually load .env.local
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                const cleanValue = value.trim().replace(/^["']|["']$/g, '');
                process.env[key.trim()] = cleanValue;
            }
        });
    }
} catch (e) { }

async function testFlash() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) { console.log("No Key"); return; }

    console.log("Testing gemini-2.5-flash with key ending in", key.slice(-4));
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    try {
        const result = await model.generateContent("Hello friend!");
        console.log("Response:", result.response.text());
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testFlash();
