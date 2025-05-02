const express = require("express");
const app = express();
const port = 3000;

const pool = require("./config/db.config");

testConnection();

app.get("/", (req, res) => {
  res.send("Hello Worasdsald!");
  testConnection();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL database!");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
