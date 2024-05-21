const express = require("express");
const app = express();
const { createServer } = require("node:http");
const server = createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);
const path = require("path");

playersData = {};

app.use(express.static(path.join(__dirname, ".")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/battleship.html");
});

server.listen(3001, () => {
  console.log("listening to port 3001");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("join-game", (shipPositions) => {
    playersData[socket.id] = shipPositions;
    console.log(playersData);
  });

  socket.on("attack", (index) => {
    console.log("attack on index ", index);
    const opponentSocket = Object.keys(playersData).find(
      (key) => key !== socket.id
    );
    console.log("opponentSocket", opponentSocket);
    const opponentShipPositions = playersData[opponentSocket];
    console.log("opponentShipPositions", opponentShipPositions.length);
    console.log(opponentShipPositions.some((arr) => arr.includes(index)));
    if (opponentShipPositions.some((arr) => arr.includes(parseInt(index)))) {
      socket.emit("touched", index);
    } else {
      socket.emit("missed", index);
    }
  });
});
