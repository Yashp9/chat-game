import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import {connectDB} from './lib/db.js'
import cookieParser from 'cookie-parser'
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app,server } from './lib/socket.js';
import gameRoutes from "./routes/game.route.js"
import './schedular.js'


dotenv.config()
const PORT = process.env.PORT
console.log("PORT =",PORT);

//for production
//http://51.20.251.120:8080

//for development
// http://localhost:5173

app.use(express.json({limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin:["http://51.20.251.120:8080"],
    credentials:true,
}))


app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);
app.use('/api/game',gameRoutes);

server.listen(PORT,()=>{
    console.log("server is running on port 5001:"+PORT)
    connectDB();
})

