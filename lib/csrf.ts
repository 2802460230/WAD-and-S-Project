import { cookies } from "next/headers";
import crypto from "crypto";

export async function generateCsrfToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set("csrf-token", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
  return token;
}

export async function validateCsrfToken(token: string): Promise<boolean> {
  const cookieStore = await cookies();
  const storedToken = cookieStore.get("csrf-token")?.value;
  if (!storedToken || !token) return false;
  return crypto.timingSafeEqual(
    Buffer.from(storedToken),
    Buffer.from(token)
  );
}