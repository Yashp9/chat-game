import Answer from "../models/answer.model.js";


import { getReceiverSocketId } from "../lib/socket.js";

import { io } from "../lib/socket.js";

export const getAnswer = async (req,res) =>{
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const answer = await Answer.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        });

        res.status(200).json(answer);
    } catch (error) {
        console.log("Error in getAnswer :",error.message);
        res.status(500).json({error:"Internal server error"});
    }
};

export const sendAnswer = async(req,res) =>{
    try {
        const{text} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        const newAnswer = new Answer({
            senderId,
            receiverId,
            text,
        })

        await newAnswer.save();
        res.status(201).json(newAnswer);
    } catch (error) {
        console.log("Error in sendAnswer controller : ",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}