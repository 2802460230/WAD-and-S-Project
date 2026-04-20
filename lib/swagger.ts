import swaggerJsdoc from "swagger-jsdoc";

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
        url: "http://localhost:3000",
        description: "Development server",
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
  apis: ["./app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);