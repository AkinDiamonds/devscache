import { registry } from "#config/openapi-registry.js";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schemas.js";

// Register schema components in OpenAPI
registry.register("RegisterInput", registerSchema);
registry.register("LoginInput", loginSchema);
registry.register("RefreshInput", refreshSchema);

// Endpoint documentation
registry.registerPath({
  method: "post",
  path: "/api/v1/auth/register",
  summary: "Register a new user account",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
    },
    422: {
      description: "Validation error or email/username already taken",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/login",
  summary: "Authenticate user and get tokens",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Authenticated successfully, returns access token and refresh token",
    },
    401: {
      description: "Invalid credentials",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/refresh",
  summary: "Refresh access token",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: refreshSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "New access token generated successfully",
    },
    401: {
      description: "Invalid or expired refresh token",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/logout",
  summary: "Logout user session",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: refreshSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Logged out successfully",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/logout-all",
  summary: "Revoke all refresh tokens for the current user",
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "All active sessions revoked",
    },
    401: {
      description: "Unauthorized",
    },
  },
});
