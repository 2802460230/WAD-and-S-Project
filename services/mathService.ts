import { geminiModel } from "@/lib/gemini";

export async function solveProblem(problem: string) {
  const prompt = `You are a math tutor. Solve the following problem step by step.
For each step provide a plain English explanation of what you are doing and why, and the mathematical result.
Also identify the topic category (e.g. Algebra, Calculus, Geometry, Trigonometry).

Return your response in this exact JSON format with no markdown, no code blocks, just raw JSON:
{
  "topic": "Algebra",
  "steps": [
    { "step": 1, "explanation": "explanation here", "result": "result here" }
  ]
}

Problem: ${problem}`;

  const result = await geminiModel.generateContent(prompt);
  const text = result.response.text();

  try {
    const parsed = JSON.parse(text);
    return { success: true, data: parsed };
  } catch {
    return { success: false, error: "Failed to parse AI response" };
  }
}

export async function generateHints(problem: string) {
  const prompt = `You are a math tutor. The student is stuck on this problem.
Do NOT give the full solution.
Give 2-3 hints that guide them toward the answer without revealing it.

Return as raw JSON only, no markdown:
{ "hints": ["hint 1", "hint 2", "hint 3"] }

Problem: ${problem}`;

  const result = await geminiModel.generateContent(prompt);
  const text = result.response.text();

  try {
    const parsed = JSON.parse(text);
    return { success: true, data: parsed };
  } catch {
    return { success: false, error: "Failed to parse hints response" };
  }
}

export async function generatePracticeProblems(topic: string) {
  const prompt = `You are a math tutor. Generate 3 practice problems on the topic of ${topic}.
Each problem should be at a similar difficulty level to a university student.

Return as raw JSON only, no markdown:
{
  "problems": [
    { "id": 1, "problem": "problem text here" },
    { "id": 2, "problem": "problem text here" },
    { "id": 3, "problem": "problem text here" }
  ]
}`;

  const result = await geminiModel.generateContent(prompt);
  const text = result.response.text();

  try {
    const parsed = JSON.parse(text);
    return { success: true, data: parsed };
  } catch {
    return { success: false, error: "Failed to parse practice problems response" };
  }
}