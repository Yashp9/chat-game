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

const userSocketMap = {}; //{userId : socketId}

//Game status for each room: {roomId : {board,currentTurn}}
const gameRooms = new Map();

//todo: getReceiverSocketId function().
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  //it is emitted to each forntend bcz every one needs to know the online users detail.
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("join_game_room", (roomId) => {
    //joining the game room.
    socket.join(roomId);

    //get the list of socketsId (player) in this game room.
    const room = io.sockets.adapter.rooms.get(roomId);
    const players = Array.from(room); //convert the set to an Array for easier access.

    setTimeout(() => {
      //if exactly two players present.
      if (players.length === 2) {
        const [playerX, playerO] = players;
        console.log("Assigning symbols to:", playerX, playerO);

        if (!playerO || !playerX) {
          console.log("Only one player joined the socket");
        }
        io.to(playerX).emit("assign_symbol", { symbol: "X"});
        io.to(playerO).emit("assign_symbol", { symbol: "O"});

        //create game board for this room
        const board = Array(9).fill(null);
        const currentTurn = "X";

        gameRooms.set(roomId,{board,currentTurn});

        io.to(roomId).emit("move_made", {
          board,
          nextTurn: currentTurn, //player X start the game.
          winner:null,
        });
      }

      console.log(`Socket ${socket.id} joined room ${roomId}`);
    }, 500);
  });

  // ---------------------- MAKE MOVE --------------------

  socket.on("make_move", ({ roomId,index,symbol,winner}) => {
    console.log(`inside make_move listener roomId = ${roomId} index = ${index} symbol = ${symbol}`);
    const game =  gameRooms.get(roomId);
    if(!game) return;

    const{board,currentTurn} = game;

    //Invalid move checks
    if(board[index] !== null) return //cell is already filled.
    if(symbol !== currentTurn) return //not this players turn.

    //make the move.
    board[index] = symbol;

    //check for win or draw here if needed in future.

    //switch turn
    const nextTurn = symbol === "X" ? "O" : "X";

    //save updated state.
    gameRooms.set(roomId,{
      board,
      currentTurn:nextTurn,
    });

    //Emit upadated board and next turn.
    io.to(roomId).emit("move_made",{
      board,
      nextTurn,
      winner,
    });
  });

  // --------------------------- RESET GAME -----------------

  socket.on("reset_game",({roomId})=>{
    const board = Array(9).fill(null);
    const currentTurn = "X";
    io.to(roomId).emit("winner_update");

    gameRooms.set(roomId,{board,currentTurn});

    io.to(roomId).emit("move_made",{
      board,
      nextTurn:currentTurn,
    });
  });

  //------------------------ DISSCONNECT ----------------------

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
