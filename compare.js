import React, { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import AvatarImage from "../assets/images/avatar.png";
import { useThemeStore } from "../store/useThemeStore";

const Playmode = () => {
  const messageEndRef = useRef(null);
  const { bgImage } = useThemeStore();

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
        <div
          ref={messageEndRef}
        >
          <div className="chat-image avatar">
            <div className="size-10 rounded-full border">
              
            </div>
          </div>

          <div className="chat-header mb-1">
            <time className="text-xs  ml-1">
              {/* {formatMessageTime(message.createdAt)} */}
            </time>
          </div>

          <div className="chat-bubble flex flex-col">
          </div>
        </div>
      </div>
      <MessageInput />
    </div>
  );
};

export default Playmode;
