import { useChatStore } from "../store/useChatStore";
import Sidebar from "../componants/Sidebar";
import NoChatSelected from "../componants/NoChatSelected";
import ChatContainer from "../componants/ChatContainer";
import { useEffect } from "react";


const HomePage = () => {
  const { selectedUser } = useChatStore();
  useEffect(()=>{
    console.log("running on ",import.meta.env.MODE , "modeee"); 
  },[])
   //checking mode ;

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> :<ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;