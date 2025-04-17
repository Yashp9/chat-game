import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./componants/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import TicTacToe from "./componants/TicTacToe";
import GameInviteNotification from "./componants/gameComponants/notification";
import { useGameStore } from "./store/useGameStore";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const { theme } = useThemeStore();
  const { notification,isReadyToPlay} = useGameStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth,notification]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex item-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      {/* Notification Component */}
      {notification && <GameInviteNotification />}

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/tictactoe" element={isReadyToPlay ? <TicTacToe />:<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
