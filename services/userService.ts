// Temporary in-memory store until Week 7 when we connect PostgreSQL
const problems: {
  id: string;
  userId: string;
  content: string;
  topic: string;
  steps: { step: number; explanation: string; result: string }[];
  createdAt: string;
}[] = [];

const bookmarks: { id: string; userId: string; problemId: string }[] = [];

export async function saveProblem(
  userId: string,
  content: string,
  topic: string,
  steps: { step: number; explanation: string; result: string }[]
) {
  const problem = {
    id: crypto.randomUUID(),
    userId,
    content,
    topic,
    steps,
    createdAt: new Date().toISOString(),
  };
  problems.push(problem);
  return { success: true, data: problem };
}

export async function getUserHistory(userId: string) {
  const userProblems = problems
    .filter((p) => p.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return { success: true, data: userProblems };
}

export async function saveBookmark(userId: string, problemId: string) {
  const existing = bookmarks.find(
    (b) => b.userId === userId && b.problemId === problemId
  );
  if (existing) {
    return { success: false, error: "Already bookmarked" };
  }
  const bookmark = { id: crypto.randomUUID(), userId, problemId };
  bookmarks.push(bookmark);
  return { success: true, data: bookmark };
}

export async function getUserBookmarks(userId: string) {
  const userBookmarks = bookmarks.filter((b) => b.userId === userId);
  const bookmarkedProblems = userBookmarks.map((b) =>
    problems.find((p) => p.id === b.problemId)
  ).filter(Boolean);
  return { success: true, data: bookmarkedProblems };
}

export async function updateUserProfile(
  userId: string,
  name: string,
  email: string
) {
  // Placeholder until Week 7 — no real DB update yet
  return { success: true, data: { userId, name, email } };
}