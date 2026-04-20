import { loginUser } from "@/services/authService";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jack@email.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 401 });
    }

    return Response.json(result.data, { status: 200 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}