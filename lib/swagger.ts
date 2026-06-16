export function getSwaggerSpec(serverUrl: string) {
  return {
    openapi: "3.0.0",
    info: {
      title: "MathMentor API",
      version: "1.0.0",
      description:
        "REST API for MathMentor — AI-powered math problem solver. COMP6703001 — BINUS University International.",
    },
    servers: [{ url: serverUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "user@example.com" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "User created successfully" },
            "400": { description: "Validation error or email already exists" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login with email and password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "user@example.com" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Login successful, JWT token returned" },
            "401": { description: "Invalid credentials" },
          },
        },
      },
      "/api/solve": {
        post: {
          tags: ["Math"],
          summary: "Submit a math problem and receive step-by-step solution",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["problem"],
                  properties: {
                    problem: { type: "string", example: "Solve x² + 5x + 6 = 0" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Solution with step-by-step explanation returned" },
            "400": { description: "Invalid input or prompt injection detected" },
            "401": { description: "Unauthorized" },
            "429": { description: "Rate limit exceeded" },
          },
        },
      },
      "/api/hints": {
        post: {
          tags: ["Math"],
          summary: "Generate hints for a math problem without full solution",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["problem"],
                  properties: {
                    problem: { type: "string", example: "Solve x² + 5x + 6 = 0" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Array of hints returned" },
            "400": { description: "Invalid input" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/practice": {
        post: {
          tags: ["Math"],
          summary: "Generate practice problems based on topic",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["topic"],
                  properties: {
                    topic: { type: "string", example: "Algebra" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Array of practice problems returned" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/ocr": {
        post: {
          tags: ["Math"],
          summary: "Upload image and extract math expression via OCR",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    image: { type: "string", format: "binary" },
                    mimeType: { type: "string", example: "image/jpeg" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Extracted math text returned" },
            "400": { description: "Invalid file or no math found" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/history": {
        get: {
          tags: ["User"],
          summary: "Get user problem history",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "Array of past problems returned" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/bookmarks": {
        get: {
          tags: ["User"],
          summary: "Get user bookmarks",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "Array of bookmarks returned" },
            "401": { description: "Unauthorized" },
          },
        },
        post: {
          tags: ["User"],
          summary: "Save a problem to bookmarks",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["problemId"],
                  properties: {
                    problemId: { type: "string", example: "uuid-here" },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Bookmark saved" },
            "400": { description: "Failed to save bookmark" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/bookmarks/{id}": {
        delete: {
          tags: ["User"],
          summary: "Remove a bookmarked problem",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Bookmark deleted" },
            "404": { description: "Bookmark not found" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/profile": {
        get: {
          tags: ["User"],
          summary: "Get current user profile",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "User profile returned" },
            "401": { description: "Unauthorized" },
          },
        },
        put: {
          tags: ["User"],
          summary: "Update user profile",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Darrus Loamayer" },
                    email: { type: "string", example: "darrus@mathmentor.com" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Profile updated" },
            "400": { description: "Validation error" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/admin/users": {
        get: {
          tags: ["Admin"],
          summary: "Get all users, AI logs and system logs (admin only)",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "All users and logs returned" },
            "401": { description: "Unauthorized" },
            "403": { description: "Forbidden — admin only" },
          },
        },
      },
      "/api/csrf": {
        get: {
          tags: ["Security"],
          summary: "Generate a CSRF token",
          responses: {
            "200": { description: "CSRF token returned" },
          },
        },
      },
    },
  };
}