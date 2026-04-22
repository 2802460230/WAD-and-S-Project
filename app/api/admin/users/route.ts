import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users, AI logs and system logs (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin data returned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin only
 *       500:
 *         description: Internal server error
 */
export async function GET(request: Request) {
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

    if (user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch recent problems as AI usage logs
    const recentProblems = await prisma.problem.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true } } },
    });

    const aiLogs = recentProblems.map((p) => ({
      id: p.id,
      user: p.user.email,
      type: p.inputType === "image" ? "OCR + Solve" : "Solve",
      createdAt: p.createdAt,
    }));

    // Use problems as system logs too for now
    const systemLogs = recentProblems.map((p) => ({
      id: p.id + "-log",
      user: p.user.email,
      action: `Submitted ${p.inputType} problem — topic: ${p.topic || "unknown"}`,
      createdAt: p.createdAt,
    }));

    return Response.json({ users, aiLogs, systemLogs }, { status: 200 });
  } catch (error) {
    console.error("Admin users error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}