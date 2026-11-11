import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
dotenv.config();

const app = express();

const PORT =
  process.env.PORT || 5000;

/*
  ===============================
  MIDDLEWARE
  ===============================
*/

/*
  CORS
*/

app.use(cors());

/*
  JSON BODY PARSER

  Increased from the default limit
  because profile images are currently
  being sent as base64 strings.
*/

app.use(
  express.json({
    limit: "6mb",
  })
);

/*
  ===============================
  DATABASE CONNECTION
  ===============================
*/

async function connectDatabase() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      "MongoDB connected successfully"
    );
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error.message
    );

    process.exit(1);
  }
}

/*
  ===============================
  TEST ROUTE
  ===============================
*/

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "BrainDump AI backend is running",
  });
});

/*
  ===============================
  AUTH ROUTES
  ===============================

  POST   /api/auth/signup
  POST   /api/auth/login
  GET    /api/auth/me
  PATCH  /api/auth/profile
  PATCH  /api/auth/password
  DELETE /api/auth/account
*/

app.use(
  "/api/auth",
  authRoutes
);

/*
  ===============================
  TASK ROUTES
  ===============================

  GET    /api/tasks
  POST   /api/tasks
  PATCH  /api/tasks/:id/toggle
  DELETE /api/tasks/:id
*/

app.use(
  "/api/tasks",
  taskRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);
/*
  ===============================
  ERROR HANDLER
  ===============================
*/

/*
  Handles oversized JSON requests.

  This is particularly useful for
  profile image uploads.
*/

app.use(
  (error, req, res, next) => {
    if (
      error instanceof SyntaxError &&
      error.status === 400 &&
      "body" in error
    ) {
      return res.status(400).json({
        message:
          "Invalid JSON request.",
      });
    }

    if (
      error.type ===
      "entity.too.large"
    ) {
      return res.status(413).json({
        message:
          "Request is too large. Please use a smaller profile image.",
      });
    }

    console.error(
      "Unhandled server error:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error.",
    });
  }
);

/*
  ===============================
  START SERVER
  ===============================
*/

async function startServer() {
  await connectDatabase();

  app.listen(
    PORT,
    () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    }
  );
}

startServer();