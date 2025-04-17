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
  } = useGameStore();

  useEffect(() => {
    if (!socket) return;

    // Incoming game request from another player
    const handleSendRequest = ({ senderPlayerInfo }) => {
      setNotification(true);
      setNotificationSenderPlayer(senderPlayerInfo);
    };

    // Response to game request (accept/reject)
    const handleResponse = (notificationResponse) => {
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
