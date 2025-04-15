import React, { useState } from "react";

const TicTacToe = () => {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const winnerInfo = calculateWinner(board);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line;

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setXIsNext(true);
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
              : "bg-[#BCFFF8] hover:bg-[#31bff3]/100"
          }

          ${
            isWinningCell
              ? "animate-pulse text-pink-400 shadow-[0_0_15px_5px] shadow-pink-500"
              : ""
          }
        `}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div
      className="flex flex-col pt-8 items-center justify-center min-h-screen bg-[#B5FCCD] text-white px-4"
      style={{ backgroundColor: "#FFFFF" }}
    >
      <h1 className="text-4xl font-bold mb-6 bg-pink-600 rounded-lg px-2 py-2 pt-2">
        Tic Tac Toe
      </h1>
      <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-[#EDFAD7] shadow-lg shadow-purple-700">
        {board.map((_, idx) => renderCell(idx))}
      </div>
      <div className="text-xl mb-4 rounded-lg bg-pink-600 text-center px-2 py-2">
        {winner
          ? `🎉 Winner: ${winner}`
          : board.every(Boolean)
          ? "😅 It's a draw!"
          : `Next Player: ${xIsNext ? "X" : "O"}`}
      </div>
      <button
        onClick={resetGame}
        className="mt-2 px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
      >
        Restart
      </button>
    </div>
  );
};

// 🧠 Modified to return both winner and line
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }

  return null;
}

export default TicTacToe;
