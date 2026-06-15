import { deleteBookmark } from "@/services/userService";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

/**
 * @swagger
 * /api/bookmarks/{id}:
 *   delete:
 *     summary: Remove a bookmarked problem
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The bookmark ID to delete
 *     responses:
 *       200:
 *         description: Bookmark deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bookmark not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = verifyToken(token);
    if (!user) {
      return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return Response.json({ error: "Bookmark ID is required" }, { status: 400 });
    }

    const result = await deleteBookmark(user.userId, id);
    if (!result.success) {
      return Response.json({ error: result.error }, { status: 404 });
    }

    return Response.json({ message: "Bookmark deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete bookmark error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
