import { extractMathFromImage } from "@/services/ocrService";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

/**
 * @swagger
 * /api/ocr:
 *   post:
 *     summary: Extract math expression from an uploaded image
 *     tags: [Math]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: JPG or PNG image of a handwritten math problem
 *     responses:
 *       200:
 *         description: Math expression extracted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 extractedText:
 *                   type: string
 *                   example: Solve x² + 5x + 6 = 0
 *       400:
 *         description: Invalid file type or missing image
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       422:
 *         description: No math problem found in image
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = verifyToken(token);
    if (!user) {
      return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Parse the form data (image comes as multipart/form-data)
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return Response.json({ error: "Image file is required" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return Response.json(
        { error: "Only JPG and PNG images are allowed" },
        { status: 400 }
      );
    }

    // Validate file size - max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "Image must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert image to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Call ocrService
    const result = await extractMathFromImage(base64, file.type);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 422 });
    }

    return Response.json(result.data, { status: 200 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}