import { getUserHistory } from "@/services/userService";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get all solved problems for the logged in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of solved problems returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   topic:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
export async function GET(request: Request) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = verifyToken(token);
    if (!user) {
      return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const result = await getUserHistory(user.userId);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json(result.data, { status: 200 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}