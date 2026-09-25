const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../src/config/db");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, username, nickname, password } = req.body;

  if (!email || !password || !nickname || !username) {
    return res.status(400).json({
      message: "모든 항목을 입력해주세요.",
    });
  }

  if (username.length < 2 || username.length > 50) {
    return res.status(400).json({
      message: "이름은 2~50자로 입력해주세요.",
    })
  }

  if (nickname.length < 2 || username.length > 50) {
    return res.status(400).json({
      message: "닉네임은 2~50자로 입력해주세요.",
    })
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "유효한 이메일 형식이 아닙니다.",
    });
  }

  if (password.length < 8 || password.length > 255) {
    return res.status(400).json({
      message: "비밀번호는 8~255자로 입력해주세요.",
    })
  }

  try {
    db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "DB 오류",
          });
        }

        if (results.length > 0) {
          return res.status(409).json({
            message: "이미 가입된 이메일입니다.",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO users (email, password, nickname, username, social_type, status)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [email, hashedPassword, nickname, username, "local", "active"],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({
                message: "회원가입 실패",
              });
            }

            return res.status(201).json({
              message: "회원가입이 완료되었습니다.",
            });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "서버 오류",
    });
  }
});

module.exports = router;