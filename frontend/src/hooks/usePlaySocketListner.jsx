import { useEffect, useCallback } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePlayStore } from "../store/usePlayStore";
import { useGameStore } from "../store/useGameStore";
import toast from "react-hot-toast";

export const usePlaySocketListner = () => {
  const { socket } = useAuthStore();
  const {
    symbol,
    setSymbol,
    setIsMyTurn,
    setBoard,
    setWinner,
    roomId,
  } = usePlayStore();
  const { setIsReadyToPlay } = useGameStore();

  // Helper to check winner — stable function
  const checkWinner = useCallback((board) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // "X" or "O"
      }
    }
    if (board.every(cell => cell)) return "draw";
    return null; // no winner yet
  }, []);

  // Stable event handler for "assign_symbol"
  const handleAssignSymbol = useCallback(({ symbol }) => {
    setSymbol(symbol);
    console.log("my symbol = ", symbol);
  }, [setSymbol]);

  // Stable event handler for "move_made"
  const handleMoveMade = useCallback(({ board, nextTurn }) => {
    setBoard(board);

    const result = checkWinner(board);

    if (result) {
      setWinner(result);
      console.log("🏆 Winner is:", result);

      setTimeout(() => {
        socket?.emit("reset_game", { roomId });
      }, 3000);
    } else {
      setIsMyTurn(nextTurn === symbol);
    }

    console.log(
      "nextTurn = ",
      nextTurn,
      "Symbol = ",
      symbol,
      "your turn ",
      nextTurn === symbol
    );
  }, [checkWinner, roomId, setBoard, setWinner, setIsMyTurn, symbol, socket]);

  // Stable event handler for "player_left"
  const handlePlayerLeft = useCallback(() => {
    toast.error("Player Left");
    setTimeout(() => {
      setIsReadyToPlay(false);
    }, 700);
  }, [setIsReadyToPlay]);

  // Stable event handler for "winner_update"
  const handleWinnerUpdate = useCallback(() => {
    setWinner(null);
  }, [setWinner]);

  // Main socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("assign_symbol", handleAssignSymbol);
    socket.on("move_made", handleMoveMade);
    socket.on("player_left", handlePlayerLeft);
    socket.on("winner_update", handleWinnerUpdate);

    return () => {
      socket.off("assign_symbol", handleAssignSymbol);
      socket.off("move_made", handleMoveMade);
      socket.off("player_left", handlePlayerLeft);
      socket.off("winner_update", handleWinnerUpdate);
    };
  }, [socket, handleAssignSymbol, handleMoveMade, handlePlayerLeft, handleWinnerUpdate]);

  // Zustand subscription for debugging
  useEffect(() => {
    const unsub = usePlayStore.subscribe(
      (state) => state.isMyTurn,
      (turn) => {
        console.log("🎯 Zustand subscription: isMyTurn changed to", turn);
      }
    );

    return () => unsub();
  }, []);
};
