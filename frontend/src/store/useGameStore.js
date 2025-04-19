import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

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
      setTimeout(()=>{
        toast.error(error.response.data.message);
      },300)
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
    console.log("came to send Notification response :-----------")
    const socket = useAuthStore.getState().socket;
    try {
      await axiosInstance.get(`/game/game_res/${get().notificationSenderPlayer._id}`, {
        params: {
          notificationResponse: data, // Example: { accepted: true }
          res_to_req_sender:useAuthStore.getState().authUser._id, //sending authuserId so that backend can send joinroom request back to him.
        },
      });
    } catch (error) {
      console.log("error in sendNotificationResponse", error);
    }
  },
}));