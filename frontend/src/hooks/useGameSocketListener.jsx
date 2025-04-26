// src/hooks/useGameSocketListeners.js
import { useEffect, useCallback } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useGameStore } from "../store/useGameStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useGameSocketListeners = () => {
  const rejectionMessages = [
    "Player ran away from the challenge!",
    "Denied! Guess you're too good to handle.",
    "Game request blocked like a pro defender!",
    "Ouch! That’s a solid no from your opponent.",
    "Rejected faster than a bad Wi-Fi connection!",
    "Player said 'nope' and vanished like a ninja!",
    "Your request got the silent treatment... but loudly.",
    "Challenge declined. Confidence not found!",
    "Opponent chose peace over war. Respect.",
    "Player skipped the boss fight—you."
  ];

  const { socket } = useAuthStore();
  const navigate = useNavigate();
  const {
    setNotification,
    setNotificationSenderPlayer,
    setIsReadyToPlay
  } = useGameStore();

  // Stable handler for "send_request"
  const handleSendRequest = useCallback(({ senderPlayerInfo }) => {
    console.log("inside handle send request");
    setNotification(true);
    setNotificationSenderPlayer(senderPlayerInfo);
  }, [setNotification, setNotificationSenderPlayer]);

  // Stable handler for "response_to_request"
  const handleResponse = useCallback((notificationResponse) => {
    if (notificationResponse.notificationResponse === "accept") {
      setIsReadyToPlay(true);
      navigate("/tictactoe");
    }
    if (notificationResponse.notificationResponse === "reject") {
      const randomMessage = rejectionMessages[Math.floor(Math.random() * rejectionMessages.length)];
      setIsReadyToPlay(false);
      toast.error(randomMessage);
    }
  }, [navigate, setIsReadyToPlay]);

  useEffect(() => {
    if (!socket) return;

    socket.on("send_request", handleSendRequest);
    socket.on("response_to_request", handleResponse);

    return () => {
      socket.off("send_request", handleSendRequest);
      socket.off("response_to_request", handleResponse);
    };
  }, [socket, handleSendRequest, handleResponse]);
};

export default useGameSocketListeners;
