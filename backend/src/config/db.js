import {neon} from "@neondatabase/serverless";
import dotenv from "dotenv/config.js";


//Creates a SQK connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);