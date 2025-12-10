import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateWrapInsights(responses: { answers: any, name: string | null }[], wrapTitle: string) {
    if (responses.length === 0) return null;

    // Flatten text answers for analysis
    const textContent = responses.map(r =>
        `Friend Name: ${r.name || 'Anonymous'}\nAnswers: ${JSON.stringify(r.answers)}`
    ).join('\n---\n');

    const prompt = `
    You are an AI analyzing a "Friendship Wrap" for a user. 
    Wrap Title: "${wrapTitle}"
    
    Here are the responses from friends:
    ${textContent}

    Generate a JSON summary with:
    1. vibeScore (0-100): How wholesome/chaotic/loving the vibes are. High = amazing.
    2. vibeSummary (string): A creative 2-sentence summary of the year based on these stories.
    3. archetype (string): One fun label for the friend group (e.g., "The Chaos Coordinators", "Wholesome Hive", "Ride or Dies").
    4. keywords (string[]): 5 emojis or words that capture the vibe.

    Return ONLY raw JSON.
  `;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: prompt }],
            model: 'gpt-4o', // Or gpt-3.5-turbo if 4o unavailable
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content");

        return JSON.parse(content);
    } catch (error) {
        console.error("AI Generation Error:", error);
        // Fallback if AI fails
        return {
            vibeScore: 85,
            vibeSummary: "A year full of beautiful memories and quiet moments shared together.",
            archetype: "The Day Ones",
            keywords: ["❤️", "✨", "🤞", "🔥", "🥺"]
        };
    }
}
