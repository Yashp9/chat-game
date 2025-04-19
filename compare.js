// // When a player joins a game room
// socket.on("join_game", ({ gameId }) => {
//   // Add the current socket (player) to the specified game room
//   socket.join(gameId);

//   // Get the list of sockets (players) in this game room
//   const room = io.sockets.adapter.rooms.get(gameId);
//   const players = Array.from(room); // Convert the Set to an Array for easier access

//   // If there are exactly 2 players in the room, start the game
//   if (players.length === 2) {
//     // Assign player symbols: first joined is 'X', second is 'O'
//     const [playerX, playerO] = players;

//     // Tell player X their symbol and that it's their turn
//     io.to(playerX).emit("assign_symbol", { symbol: "X", turn: true });

//     // Tell player O their symbol and that it's not their turn
//     io.to(playerO).emit("assign_symbol", { symbol: "O", turn: false });

//     // Initialize the game board as an empty 3x3 grid (array of 9 nulls)
//     const board = Array(9).fill(null);

//     // Notify both players that the game has started and send the initial board state
//     io.to(gameId).emit("move_made", {
//       board,
//       nextTurn: "X", // Player X starts the game
//     });
//   }
// });

// // When a player makes a move
// socket.on("make_move", ({ index }) => {
//   // This is a placeholder – you would handle the logic here to:
//   // 1. Validate the move (check if the cell is empty)
//   // 2. Update the game board state
//   // 3. Switch the turn to the next player
//   // 4. Check for a win or draw condition
//   // 5. Emit the updated board and turn info back to both players
// });

// // When a player resets the game
// socket.on("reset_game", () => {
//   // Broadcast a reset_game event to everyone in the same game room
//   // ⚠️ NOTE: This will throw an error because `gameId` is not defined in this scope
//   // You should pass `gameId` with the event or store it in socket data
//   io.to(gameId).emit("reset_game");
// });


















// import React, { useEffect, useState } from "react";
// import { usePlaySocketListner } from "../hooks/usePlaySocketListner";
// import { Socket } from "socket.io-client";

// const TicTacToe = () => {
//   const initialBoard = Array(9).fill(null);
//   const [board, setBoard] = useState(initialBoard);
//   const [xIsNext, setXIsNext] = useState(true);
//   const winnerInfo = calculateWinner(board);
//   const winner = winnerInfo?.winner;
//   const winningLine = winnerInfo?.line;

//   usePlaySocketListner(); //starts listening all the game movements.

//   const handleClick = (index) => {
//     if (board[index] || winner) return;

//     const newBoard = [...board];
//     newBoard[index] = xIsNext ? "X" : "O";
//     setBoard(newBoard);
//     setXIsNext(!xIsNext);
//   };

//   const resetGame = () => {
//     setBoard(initialBoard);
//     setXIsNext(true);
//   };

//   const renderCell = (index) => {
//     const isWinningCell = winningLine?.includes(index);
//     return (
//       <button
//         key={index}
//         onClick={() => handleClick(index)}
//         className={`
//           aspect-square w-20 sm:w-24 md:w-28 
//           rounded-2xl flex items-center justify-center 
//           text-4xl font-bold transition duration-200
//           ${
//             board[index]
//               ? "bg-[#31bff3] text-white"
//               : "bg-[#BCFFF8] hover:bg-[#31bff3]/100"
//           }

//           ${
//             isWinningCell
//               ? "animate-pulse text-pink-400 shadow-[0_0_15px_5px] shadow-pink-500"
//               : ""
//           }
//         `}
//       >
//         {board[index]}
//       </button>
//     );
//   };

//   return (
//     <div
//       className="flex flex-col pt-8 items-center justify-center min-h-screen bg-[#B5FCCD] text-white px-4"
//       style={{ backgroundColor: "#FFFFF" }}
//     >
//       <h1 className="text-4xl font-bold mb-6 bg-pink-600 rounded-lg px-2 py-2 pt-2">
//         Tic Tac Toe
//       </h1>
//       <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-[#EDFAD7] shadow-lg shadow-purple-700">
//         {board.map((_, idx) => renderCell(idx))}
//       </div>
//       <div className="text-xl mb-4 rounded-lg bg-pink-600 text-center px-2 py-2">
//         {winner
//           ? `🎉 Winner: ${winner}`
//           : board.every(Boolean)
//           ? "😅 It's a draw!"
//           : `Next Player: ${xIsNext ? "X" : "O"}`}
//       </div>
//       <button
//         onClick={resetGame}
//         className="mt-2 px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
//       >
//         Restart
//       </button>
//     </div>
//   );
// };

// // 🧠 Modified to return both winner and line
// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8], // rows
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8], // columns
//     [0, 4, 8],
//     [2, 4, 6], // diagonals
//   ];

//   for (let [a, b, c] of lines) {
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return { winner: squares[a], line: [a, b, c] };
//     }
//   }

//   return null;
// }

// export default TicTacToe;






























































// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// // Socket.io setup with CORS for frontend
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"], // your frontend URL
//   },
// });

// // Track userId to socketId mappings
// const userSocketMap = {};

// // Game state for each room: { roomId: { board, currentTurn } }
// const gameRooms = new Map();

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId) {
//     userSocketMap[userId] = socket.id;
//   }

//   // Send updated online users to everyone
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   // ------------------ JOIN GAME ROOM ------------------
//   socket.on("join_game", ({ roomId }) => {
//     socket.join(roomId);

//     const room = io.sockets.adapter.rooms.get(roomId);
//     const players = Array.from(room);

//     console.log(`Socket ${socket.id} joined room ${roomId}`);

//     if (players.length === 2) {
//       const [playerX, playerO] = players;

//       // Assign player symbols
//       io.to(playerX).emit("assign_symbol", { symbol: "X", turn: true });
//       io.to(playerO).emit("assign_symbol", { symbol: "O", turn: false });

//       // Create game board for this room
//       const board = Array(9).fill(null);
//       const currentTurn = "X";

//       // Save to gameRooms Map
//       gameRooms.set(roomId, { board, currentTurn });

//       // Notify both players game started
//       io.to(roomId).emit("move_made", {
//         board,
//         nextTurn: currentTurn,
//       });
//     }
//   });

//   // ------------------ MAKE A MOVE ------------------
//   socket.on("make_move", ({ roomId, index, symbol }) => {
//     const game = gameRooms.get(roomId);
//     if (!game) return;

//     const { board, currentTurn } = game;

//     // Invalid move checks
//     if (board[index] !== null) return; // cell already filled
//     if (symbol !== currentTurn) return; // not your turn

//     // Make the move
//     board[index] = symbol;

//     // Check for win or draw here if needed

//     // Switch turn
//     const nextTurn = symbol === "X" ? "O" : "X";

//     // Save updated state
//     gameRooms.set(roomId, {
//       board,
//       currentTurn: nextTurn,
//     });

//     // Emit updated board and next turn
//     io.to(roomId).emit("move_made", {
//       board,
//       nextTurn,
//     });
//   });

//   // ------------------ RESET GAME ------------------
//   socket.on("reset_game", ({ roomId }) => {
//     const board = Array(9).fill(null);
//     const currentTurn = "X";

//     gameRooms.set(roomId, { board, currentTurn });

//     io.to(roomId).emit("move_made", {
//       board,
//       nextTurn: currentTurn,
//     });
//   });

//   // ------------------ DISCONNECT ------------------
//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
  
//     // Remove from user map
//     delete userSocketMap[userId];

//     // Update online users list
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };





































socket.on("disconnect", () => {
  console.log("A user disconnected", socket.id);
  const userId = socket.data.userId;

  if (userId) {
    delete userSocketMap[userId];

    // Find and handle the game room the user was part of
    for (const [roomId, gameData] of gameRooms.entries()) {
      if (gameData.players?.includes(userId)) {
        io.to(roomId).emit("player_left");

        // Optional: remove the game room after a short delay
        setTimeout(() => {
          gameRooms.delete(roomId);
          console.log(`Game room ${roomId} deleted because player left`);
        }, 2000);

        break; // user can only be in one room at a time
      }
    }
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
});






































































// src/hooks/useGameSocketListeners.js
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useGameStore } from "../store/useGameStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useGameSocketListeners = () => {
  const { socket } = useAuthStore();
  const navigate = useNavigate();
  const {
    setNotification,
    setNotificationSenderPlayer,
    setIsReadyToPlay,
    isReadyToPlay,
    sendNotificationResponse
  } = useGameStore();

  useEffect(() => {
    if (!socket) return;

    // Incoming game request from another player
    const handleSendRequest = ({ senderPlayerInfo }) => {
      console.log("inside handle send request")
      if(isReadyToPlay){
        sendNotificationResponse("inMatch")
      }
      setNotification(true);
      setNotificationSenderPlayer(senderPlayerInfo);
    };

    // Response to game request (accept/reject)
    const handleResponse = (notificationResponse) => {
      if (notificationResponse.notificationResponse === "inMatch") {
        toast.error("PLAYING WITH OTHER PERSON");
      }

      if (notificationResponse.notificationResponse === "accept") {
        setIsReadyToPlay(true);
        navigate("/tictactoe"); // or just "tictactoe"
      }
      if (notificationResponse.notificationResponse === "reject") {
        setIsReadyToPlay(false);
        toast.error("DON'T WANT TO PLAY WITH YOU");
      }
    };

   

    // Register all listeners
    socket.on("send_request", handleSendRequest);
    socket.on("response_to_request", handleResponse);

    // Cleanup listeners on unmount
    return () => {
      socket.off("send_request", handleSendRequest);
      socket.off("response_to_request", handleResponse);
    };
  }, [socket, navigate, setNotification, setNotificationSenderPlayer, setIsReadyToPlay]);
};

export default useGameSocketListeners;