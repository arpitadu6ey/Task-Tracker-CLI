import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_PATH = path.join(__dirname, "tasks.json");

// ---------- Helpers ----------

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function loadTasks() {
  if (!fs.existsSync(FILE_PATH)) return [];
  try {
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    if (data.trim() === "") return [];
    return JSON.parse(data);
  } catch (err) {
    fail("tasks.json is corrupted or unreadable.");
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

function getNextId(tasks) {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map((t) => t.id)) + 1;
}

function findTask(tasks, idArg) {
  const id = Number(idArg);
  if (!idArg || !Number.isInteger(id)) {
    fail("Please provide a valid numeric task ID.");
  }
  const task = tasks.find((t) => t.id === id);
  if (!task) fail(`No task found with ID ${id}.`);
  return task;
}

// ---------- Commands ----------

function addTask(description) {
  if (!description) {
    fail('Please provide a description.\nUsage: node task-cli.js add "Buy groceries"');
  }
  const tasks = loadTasks();
  const now = new Date().toISOString();
  const task = {
    id: getNextId(tasks),
    description,
    status: "todo",
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  saveTasks(tasks);
  console.log(`Task added successfully (ID: ${task.id})`);
}

function updateTask(idArg, description) {
  if (!description) {
    fail('Please provide a new description.\nUsage: node task-cli.js update 1 "New text"');
  }
  const tasks = loadTasks();
  const task = findTask(tasks, idArg);
  task.description = description;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  console.log(`Task ${task.id} updated successfully`);
}

function deleteTask(idArg) {
  const tasks = loadTasks();
  const task = findTask(tasks, idArg);
  const remaining = tasks.filter((t) => t.id !== task.id);
  saveTasks(remaining);
  console.log(`Task ${task.id} deleted successfully`);
}

function markTask(idArg, status) {
  const tasks = loadTasks();
  const task = findTask(tasks, idArg);
  task.status = status;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  console.log(`Task ${task.id} marked as ${status}`);
}

function listTasks(filter) {
  const validFilters = ["todo", "in-progress", "done"];
  if (filter && !validFilters.includes(filter)) {
    fail(`Unknown filter "${filter}". Use: todo, in-progress, or done.`);
  }

  const tasks = loadTasks();
  const shown = filter ? tasks.filter((t) => t.status === filter) : tasks;

  if (shown.length === 0) {
    console.log("No tasks found.");
    return;
  }

  console.log("ID".padEnd(5) + "STATUS".padEnd(14) + "DESCRIPTION");
  console.log("-".repeat(45));
  shown.forEach((t) => {
    console.log(String(t.id).padEnd(5) + t.status.padEnd(14) + t.description);
  });
}

function showUsage() {
  console.log(`Task Tracker CLI

Usage:
  node task-cli.js add "description"
  node task-cli.js update <id> "new description"
  node task-cli.js delete <id>
  node task-cli.js mark-in-progress <id>
  node task-cli.js mark-done <id>
  node task-cli.js list
  node task-cli.js list todo
  node task-cli.js list in-progress
  node task-cli.js list done`);
}

// ---------- Main ----------

const [command, arg1, arg2] = process.argv.slice(2);

switch (command) {
  case "add":
    addTask(arg1);
    break;
  case "update":
    updateTask(arg1, arg2);
    break;
  case "delete":
    deleteTask(arg1);
    break;
  case "mark-in-progress":
    markTask(arg1, "in-progress");
    break;
  case "mark-done":
    markTask(arg1, "done");
    break;
  case "list":
    listTasks(arg1);
    break;
  default:
    showUsage();
}