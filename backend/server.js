import express from "express";
import dotenv from "dotenv/config.js";


const app = express();

const PORT = process.env.PORT || 8001;


app.get("/", (req, res) => {
    res.send("Tere Naina");
})

app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
})