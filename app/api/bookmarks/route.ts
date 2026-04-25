import { getUserBookmarks, saveBookmark } from "@/services/userService";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Get all bookmarked problems for the logged in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookmarked problems returned successfully
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
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Save a problem to bookmarks
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - problemId
 *             properties:
 *               problemId:
 *                 type: string
 *                 example: abc123
 *     responses:
 *       201:
 *         description: Bookmark saved successfully
 *       400:
 *         description: Problem ID required or already bookmarked
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

    const result = await getUserBookmarks(user.userId);
    return Response.json(result.data, { status: 200 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    const { problemId } = await request.json();
    if (!problemId) {
      return Response.json({ error: "Problem ID is required" }, { status: 400 });
    }

    const result = await saveBookmark(user.userId, problemId);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json(result.data, { status: 201 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}