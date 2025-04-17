import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

//todo: getReceiverSocketId function().
export function getReceiverSocketId (userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; //{userId : socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  //it is emitted to each forntend bcz every one needs to know the online users detail.
  io.emit("getOnlineUsers",Object.keys(userSocketMap))
  socket.on("join_game_room",(roomId)=>{
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
  });
});

export { io, app, server };
