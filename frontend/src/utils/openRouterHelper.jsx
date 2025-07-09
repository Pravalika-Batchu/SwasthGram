const apiKey = "Ur-API-KEY";

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
export const getGeminiSeverity = async (issueType, description, count) => {
    const prompt = `
You're a public health AI system. Based on the following hygiene issue, classify the severity into one of these categories: "high", "medium", or "low".

Issue Type: ${issueType}
Description: ${description}
Number of similar complaints: ${count}

Just respond with one word: high / medium / low. Do not include any explanation.
    `.trim();

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'X-Title': 'SwasthGram Severity Check'
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 10
            })
        });

        const data = await response.json();
        let reply = data.choices?.[0]?.message?.content?.toLowerCase()?.trim();
        console.log("🧠 AI replied with severity:", reply);

        // ✅ Normalize the response to one of the expected values
        if (reply.includes("high")) return "high";
        if (reply.includes("medium")) return "medium";
        if (reply.includes("low")) return "low";
        return "medium"; // fallback
    } catch (error) {
        console.error("Severity error:", error);
        return "medium";
    }
};
