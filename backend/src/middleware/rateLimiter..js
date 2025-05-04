import rateLimit from "express-rate-limit";

//limit each IP to 100 request per 15 minutes.
export const limiter = rateLimit({
    windowMs:5*60*1000, //5 minutes
    max:150,
    message:{
        status:429,
        message:"Too many requests from this IP, please try again later.",
    },
    standardHeaders:true, // Return rate limit info in the rateLimit Header
    legacyHeaders:false, //Disable 'X-rateLimit-* headers
});

export const burstLimiter = rateLimit({
    windowMs: 10 * 1000, // 8 sec
    max: 15,                 // Limit each IP to 100 requests per windowMs
    delayMs: 0,               // Disable any delay between requests
    burst: 8,                // Allow up to 8 requests in a burst
    message: {
      status: 429,
      message: "Too many requests .",
    },
    standardHeaders: true,    // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,     // Disable the `X-RateLimit-*` headers
  });

