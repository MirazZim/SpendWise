import express from "express";
import dotenv from "dotenv/config.js";
import { sql } from "./config/db.js";


const app = express();

//Middleware
app.use(express.json());

const PORT = process.env.PORT || 8001;


async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS transactions(
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                category VARCHAR(255) NOT NULL,
                created_at DATE NOT NULL DEFAULT CURRENT_DATE
            )
        `

        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1); // STATUS CODE 1 MEANS ERROR AND 0 MEANS SUCCESS
    }
}

//DECIMAL (10,2)
//MEANS 10 DIGITS IN TOTAL AND 2 DIGITS AFTER THE DECIMAL
//SO 123456789.12 IS VALID
//BUT 12345678912 IS NOT VALID

app.post("/api/transactions", async(req, res) => {
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
})

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
})
