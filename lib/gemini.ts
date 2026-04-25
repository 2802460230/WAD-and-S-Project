import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Gemini key first 10:", process.env.GEMINI_API_KEY?.substring(0, 10));
const apiKey = process.env.GEMINI_API_KEY;
console.log("Key first 10 chars:", apiKey?.substring(0, 10));

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});