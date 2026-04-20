import { prisma } from "@/lib/prisma";

export async function saveProblem(
  userId: string,
  content: string,
  topic: string,
  steps: { step: number; explanation: string; result: string }[]
) {
  try {
    const problem = await prisma.problem.create({
      data: {
        userId,
        content,
        topic,
        inputType: "text",
      },
    });

    const solution = await prisma.solution.create({
      data: {
        problemId: problem.id,
        steps: steps,
        topic,
      },
    });

    return { success: true, data: { problem, solution } };
  } catch {
    return { success: false, error: "Failed to save problem" };
  }
}

export async function getUserHistory(userId: string) {
  try {
    const problems = await prisma.problem.findMany({
      where: { userId },
      include: { solution: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: problems };
  } catch {
    return { success: false, error: "Failed to fetch history" };
  }
}

export async function saveBookmark(userId: string, problemId: string) {
  try {
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_problemId: { userId, problemId },
      },
    });

    if (existing) {
      return { success: false, error: "Already bookmarked" };
    }

    const bookmark = await prisma.bookmark.create({
      data: { userId, problemId },
    });

    return { success: true, data: bookmark };
  } catch {
    return { success: false, error: "Failed to save bookmark" };
  }
}

export async function getUserBookmarks(userId: string) {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: { problem: { include: { solution: true } } },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: bookmarks };
  } catch {
    return { success: false, error: "Failed to fetch bookmarks" };
  }
}

export async function updateUserProfile(
  userId: string,
  name: string,
  email: string
) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });
    return { success: true, data: { userId: user.id, name: user.name, email: user.email } };
  } catch {
    return { success: false, error: "Failed to update profile" };
  }
}