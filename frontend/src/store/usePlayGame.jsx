import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const usePlayGame = create((set,get)=>({
    gameId:null,
    board:Array(9).fill(""),
    turn:"X",
    mySymbol:"",
    currentPlayer:"",
    gameStatus:"waiting", //playing , ended

    // Actions
    setGameDataL:(data) => set(data),
    updateBoard:(index,symbol) => {
        const newBoard = [...get().board];
        newBoard[index] = symbol;
        set({board:newBoard});
    },
    resetGame:() => set({
        board:Array(9).fill(""),
        gameStatus:"waiting",
        turn:"X",
    }),
}));