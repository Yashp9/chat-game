import { getReceiverSocketId, io } from "../lib/socket.js";

export const gameRequest = (req, res) => {
  try {
    console.log("came to gameRequest")
    const { id: receiverplayerId } = req.params;
    const senderPlayerId = req.user._id;

    const receiverPlayerSocketId = getReceiverSocketId(receiverplayerId);
    if (receiverPlayerSocketId) {
      io.to(receiverPlayerSocketId).emit("send_request");
    }
    res.status(201).json({ message: "request send to playes" });
  } catch (error) {
    console.log("Error in gameRequest controller: ",error.message);
    res.status(500).json({error:"Internal server error"});
  }
};
