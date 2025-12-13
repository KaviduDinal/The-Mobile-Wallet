import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";

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

app.get("/api/transactions/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY category_at DESC
        `;

        if (transactions.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json(transactions);
    } catch (error) {
        console.log("Error fetching transactions", error);
        res.status(500).json({ message: "internal server error" });
    }
});

app.post("/api/transactions", async (req, res) => {
    try {
        const { title, amount, category, user_id } = req.body;

        if (!title || !user_id || !category || amount === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const result = await sql`
            INSERT INTO transactions (user_id, title, amount, category)
            values (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `;

        res.status(201).json(result[0]);
    } catch (error) {
        console.log("Error creating the trasaction", error);
        res.status(500).json({ message: "internal server error" });
    }
});

app.delete("/api/transactions/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid transaction id" });
        }

        const result = await sql`
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully", transaction: result[0] });
    } catch (error) {
        console.log("Error deleting the transaction", error);
        res.status(500).json({ message: "internal server error" });
    }
});

app.get("/api/transactions/summary/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
        `;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `;

        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0
        `;

        const balance = Number(balanceResult[0].balance) || 0;
        const income = Number(incomeResult[0].income) || 0;
        const expense = Math.abs(Number(expenseResult[0].expense) || 0); // return expense as positive value

        res.status(200).json({ balance, income, expense });

    } catch (error) {
        console.log("Error getting the summary", error);
        res.status(500).json({ message: "internal server error" });

    }
})
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on port", PORT);
    });
});