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

  getAnswer: async (userId) => {
    set({ isAnswerLoading: true });
    try {
      const res = await axiosInstance.get(`/game/${userId}`);
      set({ answers: res.data });
    } catch (error) {
      toast.error(error?.message);
    } finally {
      set({ isAnswerLoading: false });
    }
  },

  sendAnswer: async (answerData) => {
    const selectedUser = useChatStore.getState().selectedUser;
    const { answers } = get();

    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }

    try {
      console.log("Selected User:", selectedUser._id);
      const res = await axiosInstance.post(
        `/game/send/${selectedUser._id}`,
        answerData
      );
      set({ answers: [...answers, res.data] });
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something went wrong");
    }
  },

  subscribeToAnswer : () =>{
    console.log("hotaaaaaaaaaaaaaaaa");
    const selectedUser = useChatStore.getState().selectedUser;
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newAnswer",(newAnswer)=>{
      const isAnswerSentFromSelectedUser = newAnswer.senderId === selectedUser._id;
      console.log("hotaaaaaaaaaaaaaaaa");
      if(!isAnswerSentFromSelectedUser) return;
      console.log("lotaaaaaaaaaaaaaaaa");

      set({
        answers:[...get().answers,newAnswer],
      })
    })
  },
  unsubscribeToAnswer:(selectedUser)=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newAnswer");
  },
  
}));
