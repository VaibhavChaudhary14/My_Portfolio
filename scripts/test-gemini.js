
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
} catch (e) { console.log("Env error", e); }

async function findWorkingModel() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) { console.log("No key"); return; }
    console.log("Key:", key.slice(-4));

    const genAI = new GoogleGenerativeAI(key);
    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    for (const modelName of models) {
        console.log(`Testing ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`SUCCESS: ${modelName} works! Response: ${response.text()}`);
            return; // Exit on first success
        } catch (e) {
            console.log(`FAILED: ${modelName} - ${e.message.split('\n')[0]}`); // Print first line of error
        }
    }
    console.log("All models failed.");
}

findWorkingModel();
