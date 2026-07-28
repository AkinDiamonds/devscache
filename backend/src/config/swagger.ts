import {
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { env } from "#config/env.js";
import { registry } from "./openapi-registry.js";

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
        url: `http://localhost:${env.PORT}`,
        description: "Local Development Server",
      },
    ],
  });
}
