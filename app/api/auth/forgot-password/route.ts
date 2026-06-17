import { resetPassword } from "@/services/authService";

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Reset a forgotten password using an email address
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Validation error or no account found with that email
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return Response.json({ error: "Email and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return Response.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }

    const result = await resetPassword(email, newPassword);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json({ message: "Password reset successfully" }, { status: 200 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
