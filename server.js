const express = require("express");
const app = express();
const { createServer } = require("node:http");
const server = createServer(app);

const path = require("path");

app.use(express.static(path.join(__dirname, ".")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/battleship.html");
});

server.listen(3001, () => {
  console.log("listening to port 3001");
});
