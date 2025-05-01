import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import {connectDB} from './lib/db.js'
import cookieParser from 'cookie-parser'
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app,server } from './lib/socket.js';
import gameRoutes from "./routes/game.route.js"
import { limiter} from './middleware/rateLimiter..js';
import './schedular.js'


dotenv.config()
const PORT = process.env.PORT
console.log("PORT =",PORT);

//for production
//http://13.60.73.152:8080

//for development
// http://localhost:5173

const url = process.env.NODE_ENV === "development" ?  "http://localhost:5173" : "http://13.60.73.152:8080"

app.use(limiter);
app.use(express.json({limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin:[url],
    credentials:true,
}))


app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);
app.use('/api/game',gameRoutes);

server.listen(PORT,()=>{
    console.log("server is running on port 5001:"+PORT)
    connectDB();
})

