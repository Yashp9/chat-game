import { getReceiverSocketId, io } from "../lib/socket.js";

export const gameRequest = (req, res) => {
  try {
    console.log("came to gameRequest")
    const { id: receiverplayerId } = req.params;
    const senderPlayerInfo = req.user;

    const receiverPlayerSocketId = getReceiverSocketId(receiverplayerId);
    // const senderPlayerSocketId = getReceiverSocketId(senderPlayerId);
    if (receiverPlayerSocketId) {
      io.to(receiverPlayerSocketId).emit("send_request",{senderPlayerInfo});
    }
    res.status(201).json({ message: "request send to playes" });
  } catch (error) {
    console.log("Error in gameRequest controller: ",error.message);
    res.status(500).json({error:"Internal server error"});
  }
};

export const gameResponse = (req, res) => {
  try {
    console.log("Came to gameResponse");

    const { notificationResponse } = req.query;
    const{id:senderPlayerId} = req.params;
    
    console.log("notification response =", notificationResponse);
    const senderPlayerSocketId = getReceiverSocketId(senderPlayerId);
    if(senderPlayerSocketId){
      io.to(senderPlayerSocketId).emit("response_to_request",{notificationResponse})
    }


    // You must send a response
    res.status(200).json({ message: "Response received", notificationResponse });
  } catch (error) {
    console.log("Error in gameResponse:", error);

    // Send error response too
    res.status(500).json({ error: "Server error in gameResponse" });
  }
};
