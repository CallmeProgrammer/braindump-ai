import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
  Every task route requires authentication
*/
router.use(protect);

/*
  GET ALL TASKS
  GET /api/tasks
*/

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error(
      "Fetch tasks error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

/*
  CREATE TASK
  POST /api/tasks
*/

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      dueDate,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        message:
          "Title and category are required",
      });
    }

    const task = await Task.create({
      user: req.userId,
      title,
      description: description || "",
      category,
      priority: priority || "Medium",
      dueDate: dueDate || "",
      completed: false,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(
      "Create task error:",
      error
    );

    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});

/*
  TOGGLE TASK
  PATCH /api/tasks/:id/toggle
*/

router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.completed = !task.completed;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error(
      "Toggle task error:",
      error
    );

    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});

/*
  DELETE TASK
  DELETE /api/tasks/:id
*/

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete task error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

export default router;