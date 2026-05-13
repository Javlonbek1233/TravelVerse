import { GoogleGenAI, Type } from "@google/genai";
import { ItineraryDay } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateItinerary(params: {
  destination: string;
  days: number;
  budget: number;
  interests: string[];
}): Promise<ItineraryDay[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a detailed travel itinerary for ${params.days} days in ${params.destination}. 
    Budget: $${params.budget}. Interests: ${params.interests.join(", ")}.`,
    config: {
      systemInstruction: "You are a professional travel planner. Generate high-quality, realistic itineraries in JSON format.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.NUMBER },
            date: { type: Type.STRING },
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  location: { type: Type.STRING },
                  cost: { type: Type.NUMBER },
                  type: { type: Type.STRING }
                },
                required: ["time", "title", "description", "location", "cost", "type"]
              }
            }
          },
          required: ["day", "date", "activities"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text);
}

export async function getTripRecommendations(userInput: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: userInput,
    config: {
      systemInstruction: "You are TravelVerse's AI assistant. Recommend unique travel destinations based on user mood and interests.",
      tools: [{ googleSearch: {} }]
    }
  });
  return response.text;
}
