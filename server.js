const express = require("express");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

app.use(express.json());
require("./lib/initializeMongoose");
require("./lib/memo")(io, app);

nextApp.prepare().then(() => {
  app.all("*", (req, res) => nextHandler(req, res));
  server.listen(3000, () => console.log("Server funcionando"));
});
