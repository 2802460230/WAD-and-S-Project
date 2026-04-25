import { generatePracticeProblems } from "@/services/mathService";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

/**
 * @swagger
 * /api/practice:
 *   post:
 *     summary: Generate practice problems based on a topic
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
 *               - topic
 *             properties:
 *               topic:
 *                 type: string
 *                 example: Algebra
 *     responses:
 *       200:
 *         description: Practice problems generated successfully
 *       400:
 *         description: Topic is required
 *       401:
 *         description: Unauthorized
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

    const { topic } = await request.json();
    if (!topic || !topic.trim()) {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    const result = await generatePracticeProblems(topic);
    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json(result.data, { status: 200 });
  } catch (error) {
    console.error("Practice error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}