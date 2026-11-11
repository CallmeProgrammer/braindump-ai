
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/*
  ===============================
  CORS CONFIGURATION
  ===============================
*/

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },
  })
);

/*
  ===============================
  JSON BODY PARSER
  ===============================
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
  HEALTH CHECK ROUTE
  ===============================
*/

app.get("/", (req, res) => {
  res.status(200).json({
    message: "BrainDump AI backend is running",
  });
});

/*
  ===============================
  AUTH ROUTES
  ===============================
*/

app.use(
  "/api/auth",
  authRoutes
);

/*
  ===============================
  TASK ROUTES
  ===============================
*/

app.use(
  "/api/tasks",
  taskRoutes
);

/*
  ===============================
  AI ROUTES
  ===============================
*/

app.use(
  "/api/ai",
  aiRoutes
);

/*
  ===============================
  ERROR HANDLER
  ===============================
*/

app.use((error, req, res, next) => {
  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error
  ) {
    return res.status(400).json({
      message: "Invalid JSON request.",
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      message:
        "Request is too large. Please use a smaller profile image.",
    });
  }

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "Origin not allowed by CORS.",
    });
  }

  console.error(
    "Unhandled server error:",
    error
  );

  return res.status(500).json({
    message: "Internal server error.",
  });
});

/*
  ===============================
  START SERVER
  ===============================
*/

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
}

startServer();
