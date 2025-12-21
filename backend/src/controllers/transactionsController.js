import { sql } from "../config/db.js";

export async function getTransactionByUserId(req, res) {
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
}

export async function createTransaction(req, res) {
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
}

export async function deleteTransaction (req, res) {
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
}

export async function getSummaryByUserId(req, res) {
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
}