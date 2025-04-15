import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useGameStore = create((set, get) => ({
  notification: false,
  notificationSenderPlayer:null,
  isReadyToPlay:false,


  setIsReadyToPlay: (value) => set({ isReadyToPlay: value }),
  // Send game request notification to selected user
  sendNotification: async (selectedUser) => {
  
    try {
      await axiosInstance.get(`/game/game_req/${selectedUser._id}`);
    } catch (error) {
      console.log("error in sendNotification", error);
    }
  },

  setNotificationSenderPlayer:(data)=>{
    set({notificationSenderPlayer:data})
  },

  

  // Manually set notification state
  setNotification: (bool) => {
    set({ notification: bool });
  },

  // Respond to game request (accept/reject)
  sendNotificationResponse: async (data) => {
    const socket = useAuthStore.getState().socket;
    try {
      await axiosInstance.get(`/game/game_res/${get().notificationSenderPlayer._id}`, {
        params: {
          notificationResponse: data, // Example: { accepted: true }
        },
      });
    } catch (error) {
      console.log("error in sendNotificationResponse", error);
    }
  },
}));
