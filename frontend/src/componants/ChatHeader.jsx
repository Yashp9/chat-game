import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import AvatarImage from "../assets/images/avatar.png";
import { Link } from "react-router-dom";
import { useGameStore } from "../store/useGameStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, socket } = useAuthStore();
  const { sendNotification } = useGameStore();
  const handlePlay = () => {
    sendNotification(selectedUser);
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || AvatarImage}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button className="btn btn-soft btn-accent" onClick={handlePlay}>
          Play
        </button>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
