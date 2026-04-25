import { generateCsrfToken } from "@/lib/csrf";

export async function GET() {
  try {
    const token = await generateCsrfToken();
    return Response.json({ csrfToken: token }, { status: 200 });
  } catch {
    return Response.json({ error: "Failed to generate CSRF token" }, { status: 500 });
  }
}