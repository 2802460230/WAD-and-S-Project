import { solveProblem } from "@/services/mathService";
import { saveProblem } from "@/services/userService";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    if (!user) {
      return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Validate input
    const { problem } = await request.json();
    if (!problem || !problem.trim()) {
      return Response.json({ error: "Problem text is required" }, { status: 400 });
    }

    if (problem.length > 2000) {
      return Response.json({ error: "Problem text is too long" }, { status: 400 });
    }

    // Call mathService
    const result = await solveProblem(problem);
    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    // Save to history
    await saveProblem(
      user.userId,
      problem,
      result.data.topic,
      result.data.steps
    );

    return Response.json(result.data, { status: 200 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}