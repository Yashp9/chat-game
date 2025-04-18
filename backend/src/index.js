import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import {connectDB} from './lib/db.js'
import cookieParser from 'cookie-parser'
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app,server } from './lib/socket.js';
import gameRoutes from "./routes/game.route.js"



dotenv.config()
const PORT = process.env.PORT

app.use(express.json({limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))


app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);
app.use('/api/game',gameRoutes);


server.listen(PORT,()=>{
    console.log("server is running on port 5001 http://localhost:"+PORT)
    connectDB();
})