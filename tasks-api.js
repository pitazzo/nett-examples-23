const http = require("http");
const fs = require("node:fs/promises");

const FILE_NAME = "tasks.json";

async function handleRequests(req, res) {
  const [, endpoint] = req.url.split("/");
  const method = req.method;

  if (endpoint === "tasks" && method === "GET") {
    const tasks = await readTasks();

    res.writeHead(200);
    res.end(JSON.stringify(tasks));
    return;
  }

  if (endpoint === "completed-tasks" && method === "GET") {
    const tasks = await readTasks();
    res.writeHead(200);
    res.end(JSON.stringify(tasks.filter((task) => task.isCompleted)));
    return;
  }

  if (endpoint === "task" && method === "POST") {
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
    }

    const object = JSON.parse(raw);

    const title = object["title"];
    const category = object["category"];
    const priority = object["priority"];

    if (!title || !category || !priority) {
      res.writeHead(400);
      res.end("New tasks must include a title, a category and a priority");
      return;
    }

    if (priority !== "LOW" && priority !== "MEDIUM" && priority !== "HIGH") {
      res.writeHead(400);
      res.end("Priority must be on of LOW, MEDIUM or HIGH");
      return;
    }

    if (title.length <= 3) {
      res.writeHead(400);
      res.end("Title is too short");
      return;
    }

    const tasks = await readTasks();

    const newTask = {
      id: tasks.length + 1,
      title: title,
      category: category,
      priority: priority,
      isCompleted: false,
    };

    tasks.push(newTask);

    await writeTasks(tasks);

    res.writeHead(201);
    res.end(JSON.stringify(newTask));
    return;
  }

  if (endpoint === "task" && method === "DELETE") {
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
    }

    const object = JSON.parse(raw);
    const id = object["id"];

    if (!parseInt(id)) {
      res.writeHead(400);
      res.end("Request must include a numeric id");
      return;
    }

    let tasks = await readTasks();

    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      res.writeHead(404);
      res.end(`No task matches id ${id}`);
      return;
    }

    const fileteredTasks = tasks.filter((task) => task.id !== id);

    await writeTasks(fileteredTasks);

    res.writeHead(200);
    res.end(JSON.stringify(fileteredTasks));

    return;
  }

  if (endpoint === "complete-task" && method === "PATCH") {
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
    }

    const object = JSON.parse(raw);
    const id = object["id"];

    if (!parseInt(id)) {
      res.writeHead(400);
      res.end("Request must include a numeric id");
      return;
    }

    let tasks = await readTasks();

    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      res.writeHead(404);
      res.end(`No task matches id ${id}`);
      return;
    }

    if (tasks[index].isCompleted) {
      res.writeHead(400);
      res.end("Task is already completed");
      return;
    }

    tasks[index].isCompleted = true;

    await writeTasks(tasks);

    res.writeHead(200);
    res.end(JSON.stringify(tasks[index]));

    return;
  }

  res.writeHead(404);
  res.end(
    `Operation ${endpoint} with method ${method} is not supported by the server`
  );
}

async function readTasks() {
  return fs.readFile(FILE_NAME, "utf8").then((raw) => JSON.parse(raw));
}

async function writeTasks(tasks) {
  await fs.writeFile(FILE_NAME, JSON.stringify(tasks), "utf8");
}

async function checkApiKeyMiddleware(req, res, next) {
  const key = req.headers["authorization"];

  if (key !== "mi-key-secreta") {
    res.writeHead(401);
    res.end("Please provide a valid authorization headers");
    return;
  }

  next(req, res);
}

async function logMiddleware(req, res, next) {
  console.log(`[${new Date()}] ${req.method} -> ${req.url}`);

  next(req, res);
}

const server = http.createServer((req, res) => {
  checkApiKeyMiddleware(req, res, (req, res) => {
    logMiddleware(req, res, (req, res) => {
      handleRequests(req, res);
    });
  });
});

server.listen(3000, () =>
  console.log("Server is running at http://localhost:3000")
);
