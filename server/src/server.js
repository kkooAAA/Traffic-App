import dotenv from "dotenv";

import http from "http";

import { Server } from "socket.io";

import app from "./app.js";

import connectDB from "./config/db.js";

import { initSocket } from "./services/socket.js";

dotenv.config();

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initSocket(io);

io.on("connection", (socket) => {
  console.log("Socket Connected");
});

server.listen(process.env.PORT, () => {
  console.log(
    `Server running on ${process.env.PORT}`
  );
});