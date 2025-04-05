import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const [text, setText] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Read the image file as a base64 data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); //Save preview for rendering
    };
    reader.readAsDataURL(file); // Trigger the file reading
  };

  // Function to remove the selected image and reset the file input
  const removeImage = () => {
    setImagePreview(null); //clear the image preview.
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; //clear the file input value
    }
  };

  //Function to handle the send message form submission.
  const handleSendMessage = async (e) => {
    e.preventDefault(); //Prevent form referesh.

    // If there's no text and no image, do nothing.
    if (!text.trim() && !imagePreview) return;

    try {
      //send message data via chatStore sendMessage
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      //After sending , clear the form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.log("Failed to send message: ", error); // Log error
    }
  };

  return (
    <div className="p-4 w-full">
      {/* If there's an image preview, show it above the input */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {/* Show image preview */}
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            {/* Button to remove image */}
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                      flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main input form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Text input */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)} // Update text state
          />

          {/* Hidden file input for selecting images */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Button to open file picker */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                             ${
                               imagePreview
                                 ? "text-emerald-500"
                                 : "text-zinc-400"
                             }`}
            onClick={() => fileInputRef.current?.click()} // Open file picker
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send button - disabled if no text or image */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
