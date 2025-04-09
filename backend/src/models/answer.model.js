import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
    }
},
{timestamps:true});

const Answer = mongoose.model("Answer",answerSchema);

export default Answer;