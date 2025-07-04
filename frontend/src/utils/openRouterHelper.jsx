// src/utils/openRouterHelper.js
const apiKey = "Add-ur-api-key-here";
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

export const getGeminiSeverity = async (issueType, description) => {
    const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;

    const prompt = `You're a public health AI. Classify the hygiene issue based on severity. 
  Issue: ${issueType}, Description: ${description}. 
  Respond with just one word: "high", "medium", or "low".`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://swasthgram.netlify.app",
                "X-Title": "Swasthgram AI Severity",
            },
            body: JSON.stringify({
                model: "google/gemini-pro", // ✅ model name is important
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.choices[0]?.message?.content?.toLowerCase();
        if (reply.includes("high")) return "high";
        if (reply.includes("medium")) return "medium";
        return "low";
    } catch (error) {
        console.error("Gemini severity error:", error);
        return "medium"; // fallback
    }
};
