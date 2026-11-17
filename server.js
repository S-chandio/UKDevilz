// server.js - startup file for Plesk / Phusion Passenger
// Passenger sets process.env.PORT; Next listens on it.
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = false;
const port = parseInt(process.env.PORT || "3100", 10);
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  }).listen(port, "127.0.0.1", () => {
    console.log(`ukdevliz ready on ${port}`);
  });
});

