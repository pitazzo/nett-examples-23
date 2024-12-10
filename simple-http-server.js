const http = require("http");

const server = http.createServer(async (req, res) => {
  const [, url] = req.url.split("/");
  const method = req.method;

  if (url === "toUpperCase" && method === "POST") {
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
    }

    const object = JSON.parse(raw);

    res.writeHead(200);
    res.end(
      JSON.stringify({
        textToUppercased: object.text.toUpperCase(),
        ignore: object.ignore,
      })
    );
  } else if (url === "add" && method === "POST") {
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
    }

    const object = JSON.parse(raw);

    if (parseInt(object.a) && parseInt(object.b)) {
      res.writeHead(200);
      res.end(
        JSON.stringify({
          result: parseInt(object.a) + parseInt(object.b),
        })
      );
    } else {
      res.writeHead(400);
      res.end("Arguments a and b should be provided inside body as numbers");
    }
  } else {
    res.writeHead(404);
    res.end(
      `Operation ${url} with method ${method} is not supported by the server`
    );
  }
});

server.listen(3000, () => {
  console.log("soy el servidor y estoy corriendo en el puerto 3000");
});
