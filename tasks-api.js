const http = require("http");

async function handleRequests(req, res) {
  const [, endpoint] = req.url.split("/");
  const method = req.method;

  if (endpoint === "tasks" && method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify(tasks));
    return;
  }

  if (endpoint === "completed-tasks" && method === "GET") {
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

    const newTask = {
      id: tasks.length + 1,
      title: title,
      category: category,
      priority: priority,
      isCompleted: false,
    };

    tasks.push(newTask);

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

    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      res.writeHead(404);
      res.end(`No task matches id ${id}`);
      return;
    }

    tasks = tasks.filter((task) => task.id !== id);

    res.writeHead(200);
    res.end(JSON.stringify(tasks));

    return;
  }

  res.writeHead(404);
  res.end(
    `Operation ${endpoint} with method ${method} is not supported by the server`
  );
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
