import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
    try {
        const {user_id} = req.params;
        const transactions = await sql`
            SELECT * FROM transactions
            WHERE user_id = ${user_id}
        `

        console.log(transactions);

        res.status(200).json(transactions);

    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({message: "Failed to fetch transactions"});
    }
}

export async function deleteTransactionById(req, res){
    try {
        const {id} = req.params;


        if(isNaN(parseInt(id))) {
            return res.status(400).json({message: "Invalid transaction ID"});
        }

        const transaction = await sql`
            DELETE FROM transactions
            WHERE id = ${id}
            RETURNING *
        `

        if(transaction.length === 0) {
            return res.status(404).json({message: "Transaction not found"});
        }

        console.log(transaction);

        res.status(200).json({message: "Transaction deleted successfully"});

    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({message: "Failed to delete transaction"});
    }
}

export async function getSummaryByUserId(req, res){
    try {
        const {user_id} = req.params;
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as balance
            FROM transactions
            WHERE user_id = ${user_id}
        `

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income
            FROM transactions
            WHERE user_id = ${user_id}
            AND amount > 0
        `

        const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as expenses
            FROM transactions
            WHERE user_id = ${user_id}
            AND amount < 0
        `

        const balance = balanceResult[0].balance;
        const income = incomeResult[0].income;
        const expenses = expensesResult[0].expenses;

        console.log(balance, income, expenses);   

        res.status(200).json({balance, income, expenses});

    } catch (error) {
        console.error("Error fetching transaction summary:", error);
        res.status(500).json({message: "Failed to fetch transaction summary"});
    }
}

export async function PostTransaction(req, res){
    try {
        const {user_id, title, amount, category} = req.body;

        if(!user_id || !title || !amount || !category) {
            return res.status(400).json({message: "All fields are required"});
        }

        const transaction = await sql`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES(${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `

        console.log(transaction);

        res.status(201).json(transaction[0]);

    } catch (error) {
        console.error("Error adding transaction:", error);
        res.status(500).json({message: "Failed to add transaction"});
    }
}
