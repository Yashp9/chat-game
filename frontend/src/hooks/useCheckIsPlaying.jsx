import { useLocation } from "react-router-dom";
import { useGameStore } from "../store/useGameStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePlayStore } from "../store/usePlayStore";

const useCheckIsPlaying = () => {
  const location = useLocation();
  const {
    isReadyToPlay: isInGame,
    setIsReadyToPlay: setIsInGame,
  } = useGameStore();
  const { socket } = useAuthStore();
  const { roomId } = usePlayStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isInGame && location.pathname !== "/tictactoe") {
        console.log("User left the game page");

        // Notify server safely
        if (socket && roomId) {
          socket.emit("player-left-game", roomId);
        }

        // Update Zustand
        setIsInGame(false);
      }
    }, 500); // 500ms delay to ensure navigation is complete

    return () => clearTimeout(timeout);
  }, [location.pathname, isInGame, socket, roomId, setIsInGame]);
};

export default useCheckIsPlaying;
