const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const { readTasks, writeTasks } = require("../data/tasks");
const router = express.Router();

const tasksFile = path.join(__dirname, "../data/tasks.json");

router.get("/", async (req, res) => {
  const tasks = await readTasks();
  res.json(tasks);
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(tasksFile, "utf8");
    const tasks = JSON.parse(data);

    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res) => {
  const { title, description, status } = req.body;

  if (!title || title.length < 3) {
    return res
      .status(400)
      .json({ error: "Title must be at least 3 characters." });
  }

  if (!["todo", "in-progress", "done"].includes(status)) {
    return res
      .status(400)
      .json({ error: 'Status must be "todo", "in-progress", or "done".' });
  }

  const tasks = await readTasks();
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    description,
    status,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  await writeTasks(tasks);

  res.status(201).json(newTask);
});

module.exports = router;
