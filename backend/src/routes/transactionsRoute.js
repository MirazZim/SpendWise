import express from "express";
import { sql } from "../config/db.js";
import { deleteTransactionById, getSummaryByUserId, getTransactionsByUserId, PostTransaction } from "../controller/transactionsController.js";

const router = express.Router();

router.post("/", PostTransaction)

router.get("/:user_id", getTransactionsByUserId)

router.delete("/:id", deleteTransactionById)

router.get("/summary/:user_id", getSummaryByUserId)



export default router;