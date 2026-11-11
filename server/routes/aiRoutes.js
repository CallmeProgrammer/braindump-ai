import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  processBrainDump,
} from "../services/aiService.js";

const router = express.Router();

router.use(protect);

router.post(
  "/brain-dump",
  async (req, res) => {
    try {
      const { text } = req.body;

      if (
        !text ||
        typeof text !== "string" ||
        !text.trim()
      ) {
        return res.status(400).json({
          message:
            "Brain dump text is required.",
        });
      }

      const tasks =
        await processBrainDump(text);

      return res.status(200).json({
        tasks,
      });
    } catch (error) {
      console.error(
        "AI brain dump error:",
        error
      );

      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to process brain dump.",
      });
    }
  }
);

export default router;