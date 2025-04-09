import { create } from "zustand";

export const useThemeStore = create((set,get)=>({
    bgImage:null,
    theme:localStorage.getItem("chat-theme") || "coffee",
    setTheme:(theme) =>{
        localStorage.setItem("chat-theme",theme);
        set({theme});
    },
    setBgImage:(id)=>{
        set({bgImage:id});
    }
    
}));