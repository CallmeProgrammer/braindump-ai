import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testModels() {
  try {
    console.log("Checking available Gemini models...\n");

    const models = await ai.models.list();

    for await (const model of models) {
      const methods =
        model.supportedActions ||
        model.supportedGenerationMethods ||
        [];

      console.log("--------------------------");

      console.log("Model:", model.name);

      console.log(
        "Display Name:",
        model.displayName
      );

      console.log(
        "Supported Methods:",
        methods
      );
    }
  } catch (error) {
    console.error("Failed to list models:");
    console.error(error);
  }
}

testModels();