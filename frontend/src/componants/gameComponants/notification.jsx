import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { useNavigate } from "react-router-dom";

const GameInviteNotification = () => {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(100); // percent
  const navigate = useNavigate();
  const {
    setNotification,
    sendNotificationResponse,
    setIsReadyToPlay,
    isReadyToPlay,
    notificationSenderPlayer,
  } = useGameStore();

  useEffect(() => {
    const duration = 8000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = 100 - (currentStep / steps) * 100;
      setProgress(newProgress);
    }, interval);

    const timeout = setTimeout(() => {
      setNotification(false);
      setShow(false);
    }, duration);

    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, []);

  const handleAccept = () => {
    setNotification(false);
    sendNotificationResponse("accept");
    setIsReadyToPlay(true);
    navigate("tictactoe");
  };

  const handleReject = () => {
    setNotification(false);
    sendNotificationResponse("reject");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 w-[90%] max-w-sm bg-white border-l-8 border-blue-500 rounded-xl shadow-lg p-5 overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-blue-500" style={{ width: `${progress}%`, transition: "width 50ms linear" }} />

          {/* Title */}
          <h2 className="text-xl font-bold text-blue-600 mb-1">
            🎮 Game Request
          </h2>

          {/* Message */}
          <p className="text-gray-700 mb-4">
            <span className="font-semibold text-purple-600">{notificationSenderPlayer?.fullName}</span> wants to play
            <span className="text-pink-500 font-semibold"> Tic Tac Toe</span> with you!
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 rounded-md text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
              ❌ Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition shadow-md"
            >
              ✅ Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameInviteNotification;
