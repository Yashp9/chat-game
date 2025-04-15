import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useGameStore = create((set,get)=>({
  notification:false,

  sendNotification:async()=>{
    const selectedUser = useChatStore.getState().selectedUser;
    try {
      const res = await axiosInstance.get(`/game/game_req/${selectedUser._id}`);
    } catch (error) {
      console.log("error in sendNotification ",error)
    }
  },
  getNotification: async()=>{
    const socket = useAuthStore.getState().socket;
    socket.on("send_request",()=>{
      set({notification:true})
      console.log("cameeeeeeeeeeeee",socket)
    })
  },
  setNotification:(bool)=>{
    set({notification:bool});
  }
}))