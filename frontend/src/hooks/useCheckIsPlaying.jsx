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
  const {socket} = useAuthStore();
  const {roomId} = usePlayStore();

  useEffect(() => {
    // Use a delay to allow React Router to complete navigation
    const timeout = setTimeout(() => {
      if (isInGame && location.pathname !== "/tictactoe") {
        console.log("User left the game page");

        // Notify server
        socket.emit("player-left-game",roomId);

        // Update Zustand
        setIsInGame(false);
      }
    }, 500); // 100ms delay is usually enough

    return () => clearTimeout(timeout);
  }, [location, isInGame, setIsInGame]);
};

export default useCheckIsPlaying;