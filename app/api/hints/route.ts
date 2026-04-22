import { generateHints } from "@/services/mathService";
import { verifyToken } from "@/lib/auth";

/**
 * @swagger
 * /api/hints:
 *   post:
 *     summary: Generate hints for a math problem without revealing the full solution
 *     tags: [Math]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - problem
 *             properties:
 *               problem:
 *                 type: string
 *                 example: Solve x² + 5x + 6 = 0
 *     responses:
 *       200:
 *         description: Hints generated successfully
 *       400:
 *         description: Problem text is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    if (!user) {
      return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { problem } = await request.json();
    if (!problem || !problem.trim()) {
      return Response.json({ error: "Problem text is required" }, { status: 400 });
    }

    const result = await generateHints(problem);
    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json(result.data, { status: 200 });
  } catch (error) {
    console.error("Hints error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}