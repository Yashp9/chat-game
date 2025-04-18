import { create } from "zustand";

export const usePlayStore = create((set)=>({
    symbol:null,
    isMyTurn:false,
    board:Array(9).fill(null),
    winner:null,
    winningLine:null,
    socket:null,
    roomId:null,

    setSymbol:(symbol) => set({symbol}),
    setIsMyTurn:(turn) => set({isMyTurn:turn}),
    setBoard:(board) => set({board}),
    setWinner:(winner) => set({winner}),
    setWinningLine:(line) => set({winningLine:line}),
    setSocket:(socket) => set({socket}),
    setRoomId:(roomId) => set({roomId}), 
    resetGame:() =>set({
        board:Array(9).fill(null),
        winner:null,
        winningLine:null,
        isMyTurn:false,
    })
}))

