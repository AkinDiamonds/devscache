import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Initialize Zod OpenAPI extension once globally
extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// Register standard security scheme (Bearer JWT Token)
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Enter your Bearer JWT access token to authenticate requests",
});

// Import feature OpenAPI definitions to ensure paths are registered in registry
import "#features/auth/auth.openapi.js";
import "#features/users/users.openapi.js";

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "DevsCache API Documentation",
      version: "1.0.0",
      description: "RESTful API Specification for DevsCache backend service",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],
  });
}
