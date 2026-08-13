require('dotenv').config();

async function listModels() {
    const rawKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);
    const key = rawKeys[0];
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.models) {
            console.log('Available models for key #1:');
            data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods})`));
        } else {
            console.log('Error listing models:', data);
        }
    } catch (e) {
        console.error('Fetch error:', e.message);
    }
}

listModels();
