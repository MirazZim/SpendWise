import express from "express";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import cors from "cors";
const app = express();


//Middleware
app.use(cors({
    origin: ['http://localhost:8081', 'http://localhost:3000'], // Add your frontend URLs
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 8001;



app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
})
