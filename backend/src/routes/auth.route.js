import express from 'express';
import {signup,login,logout,updateProfile, checkAuth} from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs:5 * 60 * 1000, //5  minutes
    max:5,// limit to 5 login attempts
    message:{message:"Too many login attempts. Please try again in 5 minutes."},
});

const router = express.Router();
router.post('/signup',signup)
router.post('/login',loginLimiter,login);
router.post('/logout',logout);
router.put("/update-profile",protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth);

export default router  