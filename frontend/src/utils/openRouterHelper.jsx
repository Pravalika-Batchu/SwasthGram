const apiKey = "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";

export async function getGeminiText(prompt) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'X-Title': 'SwasthGram Chat'
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct", // ✅ more reliable, less restricted
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 200
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
// Severity Classifier
export const getGeminiSeverity = async (issueType, description) => {
    const prompt = `You're a public health AI. Classify the hygiene issue based on severity.
Issue: ${issueType}, Description: ${description}.
Respond with just one word: "high", "medium", or "low".`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://swasthgram.netlify.app',
                'X-Title': 'SwasthGram Severity Check'
            },
            body: JSON.stringify({
                model: "google/gemini-pro",  // ✅ Consistent model
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 10
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content?.toLowerCase();
        if (reply.includes("high")) return "high";
        if (reply.includes("medium")) return "medium";
        return "low";
    } catch (error) {
        console.error("Gemini severity error:", error);
        return "medium";
    }
};
