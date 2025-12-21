import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
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

async function initDB() {

    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            category_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
        console.log("DB Initialized successfully!!");
    } catch (error) {
        console.log("Error intializing DB ", error);
        process.exit(1); // status code 1 means failure, 0 success
    }
}

app.get("/", (req, res) => {
    res.send("It is working..");
});

app.use("/api/transactions",transactionRoute)
 
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on port", PORT);
    });
});