import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Gemini API key is missing.");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
});

async function testGemini() {
  try {
    console.log("Testing Gemini 3.5 Flash...");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents:
        "Reply with exactly: Gemini is working",
    });

    console.log("\nGemini response:");

    console.log(response.text);

  } catch (error) {
    console.error("\nGemini test failed:");

    console.error("Status:", error.status);

    console.error("Message:", error.message);

    console.error("Full error:", error);
  }
}

testGemini();