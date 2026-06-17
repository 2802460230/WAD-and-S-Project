import { getGroqClient, GROQ_MODEL } from "@/lib/groq";

async function chat(prompt: string): Promise<string> {
  const groq = getGroqClient();
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: GROQ_MODEL,
  });
  return completion.choices[0]?.message?.content ?? "";
}

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

  const text = await chat(prompt);

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

  const text = await chat(prompt);

  try {
    const parsed = JSON.parse(text);
    return { success: true, data: parsed };
  } catch {
    return { success: false, error: "Failed to parse hints response" };
  }
}

export async function generatePracticeProblems(topic: string, previousProblem?: string) {
  const prompt = previousProblem
    ? `You are a math tutor. Generate 1 new practice problem on the topic of ${topic}.
The new problem should be similar in style and structure to this previous problem, but not identical (vary the numbers, phrasing, or specific setup):
"${previousProblem}"
The problem should be at a similar difficulty level to a university student.

Return as raw JSON only, no markdown:
{
  "problems": [
    { "id": 1, "problem": "problem text here" }
  ]
}`
    : `You are a math tutor. Generate 1 practice problem on the topic of ${topic}.
The problem should be at a similar difficulty level to a university student.

Return as raw JSON only, no markdown:
{
  "problems": [
    { "id": 1, "problem": "problem text here" }
  ]
}`;

  const text = await chat(prompt);

  try {
    const parsed = JSON.parse(text);
    return { success: true, data: parsed };
  } catch {
    return { success: false, error: "Failed to parse practice problems response" };
  }
}
