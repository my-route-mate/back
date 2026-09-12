const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 라우터 연결
app.get("/", (req, res) => {
  res.send("Travel Map API is running");
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
