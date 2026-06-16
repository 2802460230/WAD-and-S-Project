import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

export function getSwaggerSpec(serverUrl: string) {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "MathMentor API",
        version: "1.0.0",
        description:
          "REST API for MathMentor — AI-powered math problem solver. COMP6703001 — BINUS University International.",
      },
      servers: [
        {
          url: serverUrl,
        },
      ],
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
    },
    apis: [path.join(process.cwd(), "app/api/**/*.ts")],
  };
  return swaggerJsdoc(options);
}