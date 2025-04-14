import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import AvatarImage from "../assets/images/avatar.png"


const ChatHeader = () => {
  const { selectedUser, setSelectedUser ,isPlaying , setPlaying} = useChatStore();
  const { onlineUsers } = useAuthStore();
  const handlePlay = () =>{
    setPlaying();
  }

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || AvatarImage}
                alt={selectedUser?.fullName}
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
          {/* play button */}
          {isPlaying?<button className="btn btn-soft btn-accent"  onClick={handlePlay}>LEAVE</button>:<button className="btn btn-soft btn-accent" onClick={handlePlay}>PLAY</button>}
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
