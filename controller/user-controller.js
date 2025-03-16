const {
  FindEmail_model,
  SignUpForEmail_model,
  ChangeRefreshToken_model,
  Logout_model,
} = require("../model/user-model");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const bcrypt = require("bcryptjs");

const test = async (req, res) => {
  console.log(req.newAccessToken, "kk");
  return res.json({ hi: req.newAccessToken });
};

// 이메일 관련
const signUpForEmail = async (req, res) => {
  const { email, nickname, password } = req.body;
  try {
    const existingUser = await FindEmail_model(email);
    if (existingUser) {
      return res.status(422).json({ message: "이미 존재하는 이메일 입니다." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const accessToken = generateAccessToken(email, nickname);
    const refreshToken = generateRefreshToken(email, nickname);
    const user = await SignUpForEmail_model(
      email,
      nickname,
      hashedPassword,
      refreshToken
    );
    if (user) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 14 * 24 * 60 * 60 * 1000,
      }); // 14일

      res.status(200).json({
        email,
        nickname,
        accessToken,
      });
    } else {
      res.status(500).json({ message: "서버 오류" });
    }
  } catch (err) {
    console.log(err);
  }
};

const signInForEmail = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await FindEmail_model(email);
    if (!existingUser) {
      return res.status(422).json({ message: "일치하는 회원정보가 없습니다." });
    }
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(422).json({ message: "비밀번호가 일치하지 않습니다." });
    } else {
      const accessToken = generateAccessToken(email, existingUser.nickname);
      const refreshToken = generateRefreshToken(email, existingUser.nickname);
      await ChangeRefreshToken_model(refreshToken, email);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 14 * 24 * 60 * 60 * 1000,
      }); // 14일
      res.status(200).json({
        email,
        nickname: existingUser.nickname,
        accessToken,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const logout = async (req, res) => {
  const { email } = req.body;
  try {
    const isLogout = Logout_model(email);
    if (isLogout) {
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "로그아웃 성공" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { test, signUpForEmail, signInForEmail, logout };
