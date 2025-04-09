import { useThemeStore } from "../store/useThemeStore";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import ChatBg_1 from "../assets/images/bgImg/ester.jpg";
import ChatBg_2 from "../assets/images/bgImg/pooh.jpg";
import ChatBg_3 from "../assets/images/bgImg/bicycle.jpg";
import ChatBg_4 from "../assets/images/bgImg/mushroom.jpg";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const ChatBgs = {
  "1":ChatBg_1,
  "2":ChatBg_2,
  "3":ChatBg_3,
  "4":ChatBg_4,
}

const ChatPreviewBox = ({ id, onCheck ,bg}) => {
  return (
    <div className="bg-base-100 rounded-xl border border-base-300 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-base-300 bg-base-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
            H
          </div>
          <div>
            <h3 className="font-medium text-sm">Harsh</h3>
            <p className="text-xs text-base-content/70">Online</p>
          </div>
        </div>
        {/* Checkbox */}
        <input
          type="radio"
          className="checkbox checkbox-sm"
          name="bgImage"
          onChange={(e) => {
            console.log(
              "Checkbox is",
              e.target.checked ? "checked" : "unchecked",
              "ID :",
              id
            );
            onCheck(bg);
          }}
        />
      </div>

      {/* Message area with background image */}
      <div
        className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {PREVIEW_MESSAGES.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isSent ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                message.isSent
                  ? "bg-primary text-primary-content"
                  : "bg-base-200/70"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-[10px] mt-1.5 ${
                  message.isSent
                    ? "text-primary-content/70"
                    : "text-base-content/70"
                }`}
              >
                12:00 PM
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const { theme, setTheme,setBgImage ,bgImage} = useThemeStore();

  const handleBgImage = (value) => {
    setBgImage(value);
  };
  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 max-w-5xl flex flex-col items-center pb-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 w-full max-w-md text-center"
      >
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-base-content/70">
          Customize your chat experience
        </p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="mt-6"
      >
        <button
          className="btn btn-primary flex items-center gap-2 px-6 py-3 text-lg"
          onClick={toggleDarkMode}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          {theme === "dark" ? "LIGHT MODE" : "DARK MODE"}
        </button>
      </motion.div>

      {/* Grid of 4 Chat Previews */}
      <motion.div
        className="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {Object.entries(ChatBgs).map(([key, value])=> (
          <ChatPreviewBox key={key} id={key} onCheck={handleBgImage} bg={value}/>
        ))}
      </motion.div>
    </div>
  );
};

export default SettingsPage;
