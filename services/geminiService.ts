import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: In a real production app, this should be handled via a backend proxy to hide the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeCameraFrame = async (base64Image: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Simulation Mode: API Key not configured. In a real scenario, Gemini would analyze this frame for threats, people, or package delivery.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = "You are a security assistant. Analyze this security camera frame. Briefly list what you see (people, pets, vehicles, potential threats) in 1-2 sentences. Be concise.";

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    return response.text || "No significant activity detected.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI Service unavailable momentarily.";
  }
};