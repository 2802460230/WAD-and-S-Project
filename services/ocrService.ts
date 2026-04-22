import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

// OCR needs the vision model which supports image input
const visionModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function extractMathFromImage(imageBase64: string, mimeType: string) {
  const prompt = `Look at this image. Extract only the mathematical expression or problem you see.
Return only the raw math expression as plain text, nothing else.
If you cannot find a math problem in the image, return exactly: NO_MATH_FOUND`;

  try {
    const result = await visionModel.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
      prompt,
    ]);

    const text = result.response.text().trim();

    if (text === "NO_MATH_FOUND") {
      return { success: false, error: "No math problem found in image" };
    }

    return { success: true, data: { extractedText: text } };
  } catch {
    return { success: false, error: "OCR processing failed" };
  }
}