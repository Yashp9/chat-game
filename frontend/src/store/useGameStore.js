import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useGameStore = create((set, get) => ({
  answers: [],
  selectedUser: useChatStore.getState().selectedUser,
  isUserLoading: false,
  isAnswerLoading: false,
  isPlaying: false,

  getAnswer:async (userId) =>{
    set({isAnswerLoading:true});
    try {
        const res = await axiosInstance.get(`/game/${userId}`);
        set({answers:res.data});
    } catch (error) {
        toast.error(error.response.data.message);
    }

    finally{
        set({isAnswerLoading:false});
    }
  },

  sendAnswer:async (answerData) =>{
    const {selectedUser} = get();
    try {
        const res = await axiosInstance.post(`/game/send/${selectedUser._id}`,answerData);
        set({answers:[...answers,res.data]});
    } catch (error) {
        toast.error(error.response.data.message);
    }
  }
}));
