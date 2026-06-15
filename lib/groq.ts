import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.warn("GROQ_API_KEY is not set");
}

export const groq = new Groq({ apiKey });
export const GROQ_MODEL = "llama-3.3-70b-versatile";
