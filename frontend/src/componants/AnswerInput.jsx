import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useGameStore } from "../store/useGameStore";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

const AnswerInput = () => {
  const fileInputRef = useRef(null);
  const { sendAnswer } = useGameStore();
  const [text, setText] = useState("");

  const handleSendAnswer = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    console.log("xxxxxxxxxxxxxxxxxx", text);

    try {
      //send answer via gameStore.
      await sendAnswer({
        text: text.trim(),
      });

      //after sending clear the form.
      setText("");
    } catch (error) {
      console.log("Failed to send message: ", error); // Log error
    }
  };

  return (
    <div className="p-4 w-full">
      <form onSubmit={handleSendAnswer} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Text input */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)} // Update text state
          />
        </div>

        {/* Send button - disabled if no text or image */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim()}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default AnswerInput;
