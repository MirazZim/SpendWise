import express from "express";
import dotenv from "dotenv/config.js";
import { initDB, sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

const app = express();

//Middleware
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 8001;



app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
})
