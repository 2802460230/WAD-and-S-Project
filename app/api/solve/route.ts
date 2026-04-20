import { solveProblem } from "@/services/mathService";
import { saveProblem } from "@/services/userService";
import { verifyToken } from "@/lib/auth";

/**
 * @swagger
 * /api/solve:
 *   post:
 *     summary: Submit a math problem and receive a step-by-step solution
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
 *         description: Solution generated successfully
 *       400:
 *         description: Problem text is required or too long
 *       401:
 *         description: Unauthorized - invalid or missing token
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

    if (problem.length > 2000) {
      return Response.json({ error: "Problem text is too long" }, { status: 400 });
    }

    console.log("Calling solveProblem with:", problem);
    const result = await solveProblem(problem);
    console.log("solveProblem result:", result);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    console.log("Saving problem to database");
    await saveProblem(
      user.userId,
      problem,
      result.data.topic,
      result.data.steps
    );

    return Response.json(result.data, { status: 200 });
  } catch (error) {
    console.error("Solve route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}