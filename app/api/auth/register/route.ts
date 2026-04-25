import { registerUser } from "@/services/authService";
import { sanitizeEmail } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rateLimit";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user account
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
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already registered or validation failed
 *       429:
 *         description: Too many registration attempts
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = checkRateLimit(`register:${ip}`, 3, 60 * 1000);
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many registration attempts. Please wait before trying again." },
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return Response.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const result = await registerUser(sanitizedEmail, password);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json(result.data, { status: 201 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}