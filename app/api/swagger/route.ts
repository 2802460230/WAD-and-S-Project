import { getSwaggerSpec } from "@/lib/swagger";

export async function GET(request: Request) {
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") || "http";
  const baseUrl = `${proto}://${host}`;
  return Response.json(getSwaggerSpec(baseUrl));
}