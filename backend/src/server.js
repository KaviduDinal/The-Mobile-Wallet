import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";

import transactionRoute from "./routes/transactionRoute.js";

dotenv.config();

const app = express();

// middleware
app.use(ratelimiter);
app.use(express.json());
// app.use((req, res, next) => {
//     console.log("Incoming", req.method, req.path);
//     next();
// });

const PORT = process.env.PORT || 5000;





app.use("/api/transactions",transactionRoute);

 
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on port", PORT);
    });
});