import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";

const GameInviteNotification = ({ username, onAccept, onReject }) => {
  const [show, setShow] = useState(true);
  const {setNotification} = useGameStore();

  const handleAccept = () => {
    // onAccept();         // Your socket emit logic or redirect here
    setNotification(false);    // Hide notification
  };

  const handleReject = () => {
    // onReject();         // Your socket emit or cleanup logic here
    setNotification(false);     // Hide notification
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 w-[90%] max-w-sm bg-white border-l-8 border-blue-500 rounded-xl shadow-lg p-5"
        >
          {/* Title */}
          <h2 className="text-xl font-bold text-blue-600 mb-1">
            🎮 Game Request
          </h2>

          {/* Message */}
          <p className="text-gray-700 mb-4">
            <span className="font-semibold text-purple-600">{username}</span> wants to play
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
