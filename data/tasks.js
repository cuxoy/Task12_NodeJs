const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "tasks.json");

async function readTasks() {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data || "[]");
}

async function writeTasks(tasks) {
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf8");
}

module.exports = { readTasks, writeTasks };
