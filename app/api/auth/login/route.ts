import { loginUser } from "@/services/authService";
import { sanitizeEmail } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rateLimit";

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
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 *       429:
 *         description: Too many login attempts
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = checkRateLimit(`login:${ip}`, 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many login attempts. Please wait before trying again." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) },
        }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeEmail(email);
    const result = await loginUser(sanitizedEmail, password);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 401 });
    }

    return Response.json(result.data, { status: 200 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}