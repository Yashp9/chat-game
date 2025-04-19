import React from "react";
import { usePlaySocketListner } from "../hooks/usePlaySocketListner";
import { usePlayStore } from "../store/usePlayStore";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import Confetti from "react-confetti";
import { useEffect } from "react";


const TicTacToe = () => {
  const {
    board,
    winner,
    winningLine,
    isMyTurn,
    symbol,
    setIsMyTurn,
    resetGame,
    roomId,
  } = usePlayStore();
  const {socket} = useAuthStore();
  const [confetti,setConfetti] = useState(false);

  useEffect(() => {
    if (winner) {
      setConfetti(true);
    }
    setTimeout(() => {
      setConfetti(false);
    },3000);
  }, [winner]);

  usePlaySocketListner(); // Starts all listeners like move_made, restart etc.

  const handleClick = (index) => {
    if (board[index] || winner || !isMyTurn) {
      console.log("get stuckk in handle click")
      return;
    };
    console.log("make move emitted ")

    // ✅ Emit the move using the correct event name
    socket.emit("make_move", {
      index,
      symbol,
      roomId,
    });

    // ✅ Lock the current player’s turn
    setIsMyTurn(false);
  };

  const renderCell = (index) => {
    const isWinningCell = winningLine?.includes(index);
    return (
      <button
        key={index}
        onClick={() => handleClick(index)}
        className={`
          aspect-square w-20 sm:w-24 md:w-28 
          rounded-2xl flex items-center justify-center 
          text-4xl font-bold transition duration-200
          ${
            board[index]
              ? "bg-[#31bff3] text-white"
              : isMyTurn
              ? "bg-[#BCFFF8] hover:bg-[#31bff3]/100"
              : "bg-gray-200 cursor-not-allowed"
          }
          ${
            isWinningCell
              ? "animate-pulse text-pink-400 shadow-[0_0_15px_5px] shadow-pink-500"
              : ""
          }
        `}
        disabled={!isMyTurn || board[index] || winner}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div className="flex flex-col pt-8 items-center justify-center min-h-screen bg-[#B5FCCD] text-white px-4">
      <h1 className="text-4xl font-bold mb-6 bg-pink-600 rounded-lg px-2 py-2 pt-2">
        Tic Tac Toe
      </h1>
      {confetti && <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                gravity={0.6}
                style={{ zIndex: 99 }}
                numberOfPieces={700}
                recycle={false}
        />}

      <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-[#EDFAD7] shadow-lg shadow-purple-700">
        {board.map((_, idx) => renderCell(idx))}
      </div>

      <div className="text-xl mb-4 rounded-lg bg-pink-600 text-center px-2 py-2">
        {winner
          ? `🎉 Winner: ${winner}`
          : board.every(Boolean)
          ? "😅 It's a draw!"
          : isMyTurn
          ? `⏳ Your turn (${symbol})`
          : "👀 Waiting for opponent..."}
      </div>
    </div>
  );
};

export default TicTacToe;


