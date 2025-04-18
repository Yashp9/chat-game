import { useEffect } from "react";
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
    winner,
    roomId,
    setSocket,
  } = usePlayStore();
  const {setIsReadyToPlay} = useGameStore();

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
        setTimeout(()=>{
            socket.emit("reset_game",({roomId}))
        },3000)
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
    socket.on("player_left",()=>{
      toast.error("Player Left");
      setTimeout(()=>{
        setIsReadyToPlay(false)
      },700)

    })

    return () => {
      socket.off("assign_symbol");
      socket.off("move_made");
      socket.off("player_left");
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
  useEffect(()=>{
    socket.on("winner_update",()=>{
        setWinner(null);
    })

    return () =>{
        socket.off("winner_update");
    }
  },[])
};
