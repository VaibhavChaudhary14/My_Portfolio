
const https = require('https');
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

const key = process.env.GEMINI_API_KEY;
if (!key) {
    console.log("No API Key");
    process.exit(1);
}
console.log("Key ends with:", key.slice(-4));

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log("Status Code:", res.statusCode);
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("Available Models:");
                json.models.forEach(m => console.log(m.name));
            } else {
                console.log("Response JSON (No models):", JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.log("Raw Response (Not JSON):", data);
        }
    });
}).on('error', (e) => {
    console.error("HTTPS Error:", e);
});
