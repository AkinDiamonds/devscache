import { registry } from "#config/openapi-registry.js";
import { updateUserSchema, getUserByIdSchema } from "./users.schemas.js";

// Register schemas for OpenAPI component definitions
registry.register("UpdateUserInput", updateUserSchema);
registry.register("GetUserByIdParams", getUserByIdSchema);

// Endpoint definitions
registry.registerPath({
  method: "get",
  path: "/api/v1/users/me",
  summary: "Get current authenticated user profile",
  tags: ["Users"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Profile retrieved successfully",
    },
    401: {
      description: "Unauthorized",
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/users/me",
  summary: "Update current authenticated user profile",
  tags: ["Users"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Profile updated successfully",
    },
    401: {
      description: "Unauthorized",
    },
    422: {
      description: "Validation error",
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/users/me",
  summary: "Delete current authenticated user account",
  tags: ["Users"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Account deleted successfully",
    },
    401: {
      description: "Unauthorized",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/users/{id}",
  summary: "Get public user profile by ID",
  tags: ["Users"],
  security: [{ bearerAuth: [] }],
  request: {
    params: getUserByIdSchema,
  },
  responses: {
    200: {
      description: "Public user profile retrieved",
    },
    404: {
      description: "User not found",
    },
    422: {
      description: "Invalid UUID path parameter",
    },
  },
});
