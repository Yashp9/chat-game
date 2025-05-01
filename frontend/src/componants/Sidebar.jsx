import { useEffect, useState, useMemo, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import AvatarImage from "../assets/images/avatar.png";
import { useGameStore } from "../store/useGameStore";
import { useNavigate } from "react-router-dom";
import useGameSocketListeners from "../hooks/useGameSocketListener";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, socket } = useAuthStore();
  const { setNotificationSenderPlayer, setNotification, setIsReadyToPlay, isReadyToPlay } = useGameStore();
  const navigate = useNavigate();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getUsers();
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, [getUsers]);
  
  useEffect(()=>{
    console.log("online users ====",onlineUsers);
  },[onlineUsers]);


  // Initialize game socket listeners
  useGameSocketListeners();

  // Filter users based on online status
  const filteredUsers = useMemo(() => {
    return showOnlineOnly
      ? users.filter((user) => onlineUsers.includes(user._id))
      : users;
  }, [showOnlineOnly, users, onlineUsers]);

  // Handle selecting a user
  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
  }, [setSelectedUser]);

  // Cleanup example socket listener (optional if needed later)
  useEffect(() => {
    const handleSocketEvent = (data) => {
      console.log("Socket event received:", data);
    };

    if (socket) {
      socket.on("some_event", handleSocketEvent);
    }

    return () => {
      if (socket) {
        socket.off("some_event", handleSocketEvent);
      }
    };
  }, [socket]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header Section */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length === 0 ? 0 : onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* User List Section */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => handleUserSelect(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            {/* User Avatar */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || AvatarImage}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* User Name */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {/* No users */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No online users
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
