// src/utils/openRouterHelper.js
const apiKey = "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";

export async function getGeminiText(prompt) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 150
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.choices?.[0]?.message?.content.trim() || "⚠️ AI failed to respond.";
    } catch (err) {
        console.error("Gemini text error:", err);
        return "⚠️ AI failed to respond.";
    }
}

export async function getGeminiSeverity(issueType, description) {
    const prompt = `
You are a public health risk expert. A hygiene report has come in:
- Issue Type: ${issueType}
- Description: ${description || 'None'}
- Season: ${new Date().toLocaleString('en-IN', { month: 'long' })}

Return severity as HIGH / MEDIUM / LOW. Respond with one word only.
`.trim();

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 10
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content?.toUpperCase().trim() || "MEDIUM";
        return reply.includes("HIGH") ? "high" : reply.includes("MEDIUM") ? "medium" : "low";
    } catch (err) {
        console.error("Gemini severity error:", err);
        return "medium";
    }
}