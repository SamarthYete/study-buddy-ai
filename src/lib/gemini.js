import OpenAI from "openai";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// OpenRouter client — uses OpenAI SDK with a custom baseURL
const client = new OpenAI({
    apiKey: API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true, // Required for client-side usage
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "StudyBuddy AI",
    },
});

export async function generateContent(prompt) {
    if (!API_KEY) {
        throw new Error("Missing OpenRouter API Key. Please add VITE_OPENROUTER_API_KEY to your .env file.");
    }

    try {
        const completion = await client.chat.completions.create({
            model: "mistralai/mistral-7b-instruct",
            messages: [
                {
                    role: "system",
                    content: "You are StudyBuddy AI — a friendly, knowledgeable tutor. Explain concepts clearly, use simple language, real-world analogies, and format responses with Markdown (headers, bullet points, bold text).",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
}
