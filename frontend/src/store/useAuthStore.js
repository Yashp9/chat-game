import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth : async () =>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});

            //socket implementaion.
        } catch (error) {
            console.log("Error in checkAuth :",error);
            set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
    },

    signup: async (data) =>{
        set({isSigningUp:true});
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully");
            //socket io implementation

        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({isSigningUp:false});
        }
    },

    login:async (data) =>{
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged In Successfully");

            //implement the socket io.
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({isLoggingIn:false});
        }
    },

    logout:async () =>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success('Logged out successfully');
            //implement socket.io
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) =>{
        set({isUpdatingProfile:false});
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile Updated Successfully");
        } catch (error) {
            console.log("error in update profilee :- ",error);
            toast.error(error.message);
        }
        finally{
            set({isUpdatingProfile:false});
        }
    }

}))








