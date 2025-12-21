import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
    try {
        //here we just kept it simple.
        //in a real-world-app you'd like to put the ier id or ipAddress as your key
        const { success } = await ratelimit.limit("my-rate-limit")
         if(!success){
            return res.status(429).json({
                message:"Too many requests try again later"});
        }

        next();
 
    } catch (error) {
        console.log("Rate limit error", error);
        next(error);
        

    }
};

export default ratelimiter;
