import { getReceiverSocketId, io , isUserInGame} from "../lib/socket.js";
import { v4 as uuidv4 } from 'uuid';

// ✅ Handles game request (player A → player B)
export const gameRequest = (req, res) => {
  try {
    console.log("came to gameRequest");

    const { id: receiverplayerId } = req.params; // player B's ID
    const senderPlayerInfo = req.user; // player A's info
    if(isUserInGame(receiverplayerId)){
      return res.status(403).json({message:"Player is already in a game"});
    }

    const receiverPlayerSocketId = getReceiverSocketId(receiverplayerId);

    // ✅ Check if receiver is online
    if (receiverPlayerSocketId) {
      io.to(receiverPlayerSocketId).emit("send_request", { senderPlayerInfo });
      return res.status(201).json({ message: "Request sent to player" }); // ✅ fixed typo
    } else {
      return res.status(404).json({ message: "Receiver is not online" }); // ✅ fallback added
    }

  } catch (error) {
    console.log("Error in gameRequest controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Handles the response to a game request (accept/reject)
export const gameResponseToRequest = (req, res) => {
  try {
    console.log("Came to gameResponse");

    // 🧠 Consider renaming 'res_to_req_sender' to 'receiverId' for better clarity
    const { notificationResponse, res_to_req_sender: receiverId } = req.query;
    const { id: reqSenderPlayerId } = req.params;

    console.log("notification response =", notificationResponse);

    const senderPlayerSocketId = getReceiverSocketId(reqSenderPlayerId);
    const receiverPlayerSocketId = getReceiverSocketId(receiverId);

    if (senderPlayerSocketId) {
      io.to(senderPlayerSocketId).emit("response_to_request", { notificationResponse });
    }

    // ✅ If accepted, send both players into game room
    if (notificationResponse === "accept" && senderPlayerSocketId && receiverPlayerSocketId) {
      const roomId = uuidv4();
      io.to([senderPlayerSocketId, receiverPlayerSocketId]).emit("start_game", { roomId });
    }

    res.status(200).json({ message: "Response handled", notificationResponse });
  } catch (error) {
    console.log("Error in gameResponse:", error);
    res.status(500).json({ error: "Server error in gameResponse" });
  }
};
