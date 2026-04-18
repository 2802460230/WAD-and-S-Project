import { extractMathFromImage } from "@/services/ocrService";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    if (!user) {
      return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Parse the form data (image comes as multipart/form-data)
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return Response.json({ error: "Image file is required" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return Response.json(
        { error: "Only JPG and PNG images are allowed" },
        { status: 400 }
      );
    }

    // Validate file size - max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "Image must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert image to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Call ocrService
    const result = await extractMathFromImage(base64, file.type);

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 422 });
    }

    return Response.json(result.data, { status: 200 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}