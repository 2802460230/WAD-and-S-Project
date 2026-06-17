import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function registerUser(email: string, password: string) {
  try {
    console.log("Attempting to register:", email);

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    console.log("Existing user check done:", existing);

    if (existing) {
      return { success: false, error: "Email already registered" };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "student",
      },
    });

    console.log("User created:", user.id);

    return {
      success: true,
      data: { id: user.id, email: user.email, role: user.role },
    };
  } catch (error) {
    console.error("Registration error full details:", error);
    return { success: false, error: "Registration failed" };
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return { success: false, error: "Current password is incorrect" };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to change password" };
  }
}

export async function resetPassword(email: string, newPassword: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "No account found with that email" };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to reset password" };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return { success: false, error: "Invalid email or password" };
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      success: true,
      data: { token, email: user.email, role: user.role },
    };
  } catch (error) {
    console.error("Login error full details:", error);
    return { success: false, error: "Login failed" };
  }
}