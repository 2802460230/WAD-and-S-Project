import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

// Temporary in-memory store until Week 7 when we connect PostgreSQL
const users: { id: string; email: string; passwordHash: string; role: string }[] = [];

export async function registerUser(email: string, password: string) {
  // Check if email already exists
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return { success: false, error: "Email already registered" };
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = {
    id: crypto.randomUUID(),
    email,
    passwordHash,
    role: "student",
  };

  users.push(user);

  return { success: true, data: { id: user.id, email: user.email, role: user.role } };
}

export async function loginUser(email: string, password: string) {
  // Find user by email
  const user = users.find((u) => u.email === email);
  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  // Check password
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

  // Generate JWT token
  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return { success: true, data: { token, email: user.email, role: user.role } };
}