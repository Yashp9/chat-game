import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

//for development
// "http://localhost:5173"

//for production
// http://51.20.251.120:8080

const io = new Server(server, {
  cors: {
    origin: ["http://51.20.251.120:8080"],
  },
});

const userSocketMap = {}; // { userId: socketId }
const gameRooms = new Map(); // { roomId: { board, currentTurn } }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    socket.data.userId = userId; // ✅ store userId locally for cleanup
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Notify all clients

  //  JOIN GAME ROOM
  socket.on("join_game_room", (roomId) => {
    socket.join(roomId);

    const room = io.sockets.adapter.rooms.get(roomId);
    const players = Array.from(room);

    setTimeout(() => {
      if (players.length === 2) {
        const [playerX, playerO] = players;

        //getting the userId from all sockets which i have stored while creating socket instance.
        const playerXUserId = io.sockets.sockets.get(playerX)?.data.userId;
        const playerOUserId = io.sockets.sockets.get(playerO)?.data.userId;


        console.log("Assigning symbols to:", playerX, playerO);

        if (!playerO || !playerX) {
          console.log("Only one player joined the socket");
        }

        io.to(playerX).emit("assign_symbol", { symbol: "X" });
        io.to(playerO).emit("assign_symbol", { symbol: "O" });

        const board = Array(9).fill(null);
        const currentTurn = "X";

        gameRooms.set(roomId, { board, currentTurn , players:[playerXUserId,playerOUserId] });

        io.to(roomId).emit("move_made", {
          board,
          nextTurn: currentTurn,
          winner: null,
        });
      }

      console.log(`Socket ${socket.id} joined room ${roomId}`);
    }, 500);
  });

  //  MAKE MOVE
  socket.on("make_move", ({ roomId, index, symbol, winner }) => {
    const prevState = gameRooms.get(roomId);
    console.log(`inside make_move listener roomId = ${roomId} index = ${index} symbol = ${symbol}`);
    const game = gameRooms.get(roomId);
    if (!game) return;

    const { board, currentTurn } = game;

    if (board[index] !== null) return; // cell is already taken
    if (symbol !== currentTurn) return; // not this player's turn

    board[index] = symbol;
    const nextTurn = symbol === "X" ? "O" : "X";

    gameRooms.set(roomId, {
      ...prevState, // keep previous properties like players
      board,
      currentTurn: nextTurn,
    });

    io.to(roomId).emit("move_made", {
      board,
      nextTurn,
      winner,
    });
  });

  // RESET GAME
  socket.on("reset_game", ({ roomId }) => {
    const prevState = gameRooms.get(roomId);
    const board = Array(9).fill(null);
    const currentTurn = "X";

    io.to(roomId).emit("winner_update");
    gameRooms.set(roomId, { board, currentTurn });

    io.to(roomId).emit("move_made", {
      ...prevState,
      board,
      nextTurn: currentTurn,
    });
  });

  // PLAYER LEFT
  socket.on("player-left-game", (roomId) => {
    io.to(roomId).emit("player_left");
    setTimeout(()=>{
      gameRooms.delete(roomId);
      console.log(`Game room ${roomId} deleted beccause player left`)
    },2000)
  });

  // DISCONNECT CLEANUP
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    const userId = socket.data.userId;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    if(userId){
      delete userSocketMap[userId];
      for (const [roomId,gameData] of gameRooms.entries()){
        if(gameData.players?.includes(userId)){
          io.to(roomId).emit("player_left");

          //remove the gameRoom after a short delay bcz it takes time.
          setTimeout(()=>{
            gameRooms.delete(roomId);
            console.log(`Game room ${roomId} deleted beccause player left`)
          },2000);
          break; //user can only be in one room at a time
        }
      }
    }

  });
});


export function isUserInGame (userId) {
  for(const[,gameData] of gameRooms.entries()){
    if(gameData.players?.includes(userId)){
      return true;
    }
  }
  return false;
}

export { io, app, server };