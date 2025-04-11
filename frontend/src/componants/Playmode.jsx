import React, { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import AvatarImage from "../assets/images/avatar.png";
import { useThemeStore } from "../store/useThemeStore";
import { useGameStore } from "../store/useGameStore";
import AnswerInput from "./AnswerInput";

const Playmode = () => {
  const messageEndRef = useRef(null);
  const { bgImage } = useThemeStore();
  const { authUser } = useAuthStore();
  const {selectedUser}=useChatStore();
  const { answers, getAnswer,isUserLoading, isAnswerLoading, isPlaying } =
    useGameStore();
    useEffect(()=>{
        getAnswer(selectedUser._id);
    },[getAnswer])

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {answers.map((answer) => (
          <div
            key={answer._id}
            className={`chat ${
              answer.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    answer.senderId === authUser._id
                      ? authUser.profilePic || AvatarImage
                      : selectedUser.profilePic || AvatarImage
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs  ml-1">
                {formatMessageTime(answer.createdAt)}
              </time>
            </div>

            <div className="chat-bubble flex flex-col">
              {answer.text && <p>{answer.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <AnswerInput />
    </div>
  );
};

export default Playmode;
