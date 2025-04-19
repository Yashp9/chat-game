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
      // if(isReadyToPlay){
      //   sendNotificationResponse("inMatch")
      // }
      setNotification(true);
      setNotificationSenderPlayer(senderPlayerInfo);
    };

    // Response to game request (accept/reject)
    const handleResponse = (notificationResponse) => {
      // if (notificationResponse.notificationResponse === "inMatch") {
      //   toast.error("PLAYING WITH OTHER PERSON");
      // }

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