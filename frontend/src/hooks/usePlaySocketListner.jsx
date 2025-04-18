import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePlayStore } from "../store/usePlayStore";

export const usePlaySocketListner = () => {
  const { socket } = useAuthStore();
  const {
    symbol,
    setSymbol,
    setIsMyTurn,
    setBoard,
    setWinner,
    winner,
    roomId,
    setSocket,
  } = usePlayStore();

  useEffect(() => {
    if (!socket) return;

    // Helper function to check for a winner
    const checkWinner = (board) => {
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
        if (
          board[a] &&
          board[a] === board[b] &&
          board[a] === board[c]
        ) {
          return board[a]; // "X" or "O"
        }
      }

      if (board.every(cell => cell)) return "draw";

      return null; // no winner yet
    };

    socket.on("assign_symbol", ({ symbol }) => {
      setSymbol(symbol);
      console.log("my symbol = ", symbol);
    });

    socket.on("move_made", ({ board, nextTurn }) => {
      setBoard(board);

      const result = checkWinner(board);
      

      if (result) {
        setWinner(result);
        console.log("🏆 Winner is:", result);
        console.log("trigredddddddddddddddddddddddddd")
        socket.emit("reset_game",({roomId}))
      } else {
        nextTurn === symbol ? setIsMyTurn(true) : setIsMyTurn(false);
      }

      console.log(
        "nextTurn = ",
        nextTurn,
        "Symbol = ",
        symbol,
        "your turn ",
        nextTurn === symbol
      );
    });

    return () => {
      socket.off("assign_symbol");
      socket.off("move_made");
    };
  }, [socket, symbol]);

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
