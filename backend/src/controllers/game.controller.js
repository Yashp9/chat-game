import { getReceiverSocketId, io } from "../lib/socket.js";
import { v4 as uuidv4 } from 'uuid';

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

export const gameResponseToRequest = (req, res) => {
  try {
    console.log("Came to gameResponse");
    //getting both req sender and response_to_request sender
    const { notificationResponse,res_to_req_sender:receiverId } = req.query;
    const{id:reqSenderPlayerId} = req.params;
    
    console.log("notification response =", notificationResponse);
    //getting both socketId form getReceiverSocketId();
    const senderPlayerSocketId = getReceiverSocketId(reqSenderPlayerId);
    const receiverPlayerSocketId = getReceiverSocketId(receiverId);

    if(senderPlayerSocketId){
      io.to(senderPlayerSocketId).emit("response_to_request",{notificationResponse})
    }

    if(notificationResponse === "accept" && senderPlayerSocketId && receiverPlayerSocketId){
      const roomId = uuidv4();

      //telling both the user to join the room(here -> frontend -> backend(socket.js))
      io.to([senderPlayerSocketId,receiverPlayerSocketId]).emit("start_game",{roomId});
    }


    // You must send a response
    res.status(200).json({ message: "Response handled", notificationResponse });
  } catch (error) {
    console.log("Error in gameResponse:", error);
    // Send error response too
    res.status(500).json({ error: "Server error in gameResponse" });
  }
};
