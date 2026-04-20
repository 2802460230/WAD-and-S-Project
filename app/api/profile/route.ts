import { updateUserProfile } from "@/services/userService";
import { verifyToken } from "@/lib/auth";

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update current user profile
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
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jack J. Jackson
 *               email:
 *                 type: string
 *                 example: jack@email.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Name and email are required
 *       401:
 *         description: Unauthorized - invalid or missing token
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

    // Return user data from token for now
    // Week 7: fetch full profile from database
    return Response.json({
      userId: user.userId,
      email: user.email,
      role: user.role,
    }, { status: 200 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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

    const { name, email } = await request.json();

    if (!name || !email) {
      return Response.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const result = await updateUserProfile(user.userId, name, email);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json(result.data, { status: 200 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}