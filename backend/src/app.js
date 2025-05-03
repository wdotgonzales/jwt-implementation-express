import express from "express";
import authRoutes from "./routes/authRoutes.js";
import pool from "./config/db.config.js";

const app = express();

const PORT = 3000;

// Debugging middleware - should appear first
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Body parser MUST come before routes
app.use(express.json());

// Test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ status: "hotdog" });
});

// Mount auth routes with debug
console.log("Mounting auth routes..."); // Should appear in console
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Test DB connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}
testConnection();
