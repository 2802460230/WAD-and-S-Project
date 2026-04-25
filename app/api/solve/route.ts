import { solveProblem } from "@/services/mathService";
import { saveProblem } from "@/services/userService";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { sanitizeInput, detectPromptInjection } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rateLimit";

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
 *       429:
 *         description: Too many requests
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

    // Rate limiting
    const rateLimit = checkRateLimit(`solve:${user.userId}`, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many requests. Please wait before submitting another problem." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) },
        }
      );
    }

    const { problem } = await request.json();

    if (!problem || !problem.trim()) {
      return Response.json({ error: "Problem text is required" }, { status: 400 });
    }

    if (problem.length > 2000) {
      return Response.json({ error: "Problem text is too long" }, { status: 400 });
    }

    // Check for prompt injection
    if (detectPromptInjection(problem)) {
      return Response.json({ error: "Invalid input detected" }, { status: 400 });
    }

    // Sanitize input
    const sanitizedProblem = sanitizeInput(problem);

    const result = await solveProblem(sanitizedProblem);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    await saveProblem(
      user.userId,
      sanitizedProblem,
      result.data.topic,
      result.data.steps
    );

    return Response.json(result.data, { status: 200 });
  } catch (error) {
    console.error("Solve route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}