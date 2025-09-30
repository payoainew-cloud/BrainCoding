import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSimpleExplanation(rule: string): Promise<string> {
  try {
    const prompt = `Jesteś wesołym, przyjaznym robotem-nauczycielem o imieniu BrainBot! 🤖 Twoim zadaniem jest wyjaśnienie poniższej regułki w super prosty i zabawny sposób, tak jakbyś tłumaczył to 7-latkowi. Używaj dużo emotikonek ✨, prostych porównań i krótkich zdań. Formatuj odpowiedź, używając **pogrubień** dla ważnych słów. Niech to będzie przygoda! 🚀

Regułka: "${rule}"

Twoje mega proste wyjaśnienie:`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating explanation from Gemini:", error);
    throw new Error("Failed to get explanation from AI.");
  }
}