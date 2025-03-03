const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const pool = require("./config/db");
const routes = require("./routes");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// 기본 라우트
app.use("/", routes);

// 사용자 관련 라우터 등록

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
