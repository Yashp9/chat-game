import rateLimit from "express-rate-limit";

//limit each IP to 100 request per 15 minutes.
const limiter = rateLimit({
    windowMs:15*60*1000, //15 minutes
    max:100,
    message:{
        status:429,
        message:"Too many requests from this IP, please try again later.",
    },
    standardHeaders:true, // Return rate limit info in the rateLimit Header
    legacyHeaders:false, //Disable 'X-rateLimit-* headers
});

export  default limiter;