import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Define schema for structured output
const anomalySchema = {
  type: Type.OBJECT,
  properties: {
    riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
    anomalies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          itemId: { type: Type.STRING },
          issue: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        }
      }
    },
    summary: { type: Type.STRING }
  },
  required: ['riskLevel', 'anomalies', 'summary']
};

export const analyzeInventoryRisks = async (inventoryData: InventoryItem[]) => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing for Gemini.");
    return {
      riskLevel: "Unknown",
      anomalies: [],
      summary: "AI analysis requires a valid API Key configuration."
    };
  }

  try {
    const prompt = `
      Analyze the following Workshop Inventory data for anomalies, stock risks, and potential fraud patterns.
      Context: This is a high-end automotive workshop.
      
      Inventory Data:
      ${JSON.stringify(inventoryData)}
      
      Look for:
      1. Items significantly below minimum stock levels.
      2. High value items with low quantity.
      3. Discrepancies in logical stocking patterns.
      
      Return JSON only.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: anomalySchema,
        temperature: 0.2, // Low temperature for analytical precision
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response from AI");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      riskLevel: "Error",
      anomalies: [],
      summary: "Failed to perform AI analysis. Please check system logs."
    };
  }
};
