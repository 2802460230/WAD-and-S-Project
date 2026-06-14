import { groq } from "@/lib/groq";

const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export async function extractMathFromImage(imageBase64: string, mimeType: string) {
  try {
    const completion = await groq.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
            {
              type: "text",
              text: `Look at this image. Extract only the mathematical expression or problem you see.
Return only the raw math expression as plain text, nothing else.
If you cannot find a math problem in the image, return exactly: NO_MATH_FOUND`,
            },
          ],
        },
      ],
      max_tokens: 512,
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";

    if (!text || text === "NO_MATH_FOUND") {
      return { success: false, error: "No math problem found in image" };
    }

    return { success: true, data: { extractedText: text } };
  } catch (err) {
    console.error("[ocrService] Groq vision call failed:", err);
    return { success: false, error: "OCR processing failed" };
  }
}
