import express from "express";
import authRoutes from "./routes/authRoutes.js";
import pool from "./config/db.config.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

const PORT = 5000;

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Test DB connection
// async function testConnection() {
//   try {
//     const connection = await pool.getConnection();
//     console.log("✅ Database connected successfully");
//     connection.release();
//   } catch (error) {
//     console.error("❌ Database connection failed:", error);
//   }
// }
// testConnection();
