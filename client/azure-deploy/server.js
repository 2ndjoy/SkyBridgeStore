
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

http.createServer((req, res) => {
  const pathname = decodeURIComponent(
    new URL(req.url, "http://localhost").pathname
  );

  const requested = path.resolve(root, "." + pathname);

  if (requested !== root && !requested.startsWith(root + path.sep)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  const file = fs.existsSync(requested) && fs.statSync(requested).isFile()
    ? requested
    : path.join(root, "index.html");

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end("Unable to load page");
    }

    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream"
    });
    res.end(data);
  });
}).listen(process.env.PORT || 8080, "0.0.0.0");
