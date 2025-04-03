import { useThemeStore } from "../store/useThemeStore";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  
  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="space-y-6 w-full max-w-md text-center"
      >
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-base-content/70">Customize your chat experience</p>
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
          {theme === "dark" ? "LIGHT MODE":"DARK MODE"} 
        
        </button>
      </motion.div>

      {/* Preview Section */}
      <motion.div 
        className="mt-10 w-full max-w-lg bg-base-100 rounded-xl border border-base-300 shadow-lg overflow-hidden"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
      >
        <div className="p-4 bg-base-200">
          <div className="max-w-lg mx-auto">
            <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                    J
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">John Doe</h3>
                    <p className="text-xs text-base-content/70">Online</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                {PREVIEW_MESSAGES.map((message) => (
                  <div key={message.id} className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl p-3 shadow-sm ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-[10px] mt-1.5 ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}`}>12:00 PM</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
