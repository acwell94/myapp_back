const pool = require("../config/db");

// 이메일 찾기
const FindEmail_model = async (email) => {
  try {
    const query = `SELECT * FROM user WHERE email = ?;`;
    const [rows] = await pool.execute(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    return null;
  }
};

// 이메일 회원가입
const SignUpForEmail_model = async (email, nickname, password, refresh) => {
  try {
    const query = `INSERT INTO user (email, nickname, password, refresh_token) VALUES (?,?,?,?);`;
    const [rows] = await pool.execute(query, [
      email,
      nickname,
      password,
      refresh,
    ]);
    return true;
  } catch (err) {
    console.error("DB 오류:", err);
    return false;
  }
};
// 로그아웃
const Logout_model = async (email) => {
  try {
    const query = `UPDATE user SET refresh_token = NULL WHERE email = ?;`;
    const [rows] = await pool.execute(query, [email]);
    return true;
  } catch (err) {
    return false;
  }
};

// 리프레시 토큰으로 유저 정보 받아오기
const GetUserByRefreshToken_model = async (refresh) => {
  try {
    const query = `SELECT * FROM user WHERE refresh_token = ?;`;
    const [rows] = await pool.query(query, [refresh]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("DB 오류:", err);
    return null;
  }
};

// 리프레시 토큰 변경
const ChangeRefreshToken_model = async (refresh, email) => {
  try {
    const query = `UPDATE user SET refresh_token = ? WHERE email = ?;`;
    const [rows] = await pool.query(query, [refresh, email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    return false;
  }
};

module.exports = {
  FindEmail_model,
  SignUpForEmail_model,
  Logout_model,
  GetUserByRefreshToken_model,
  ChangeRefreshToken_model,
};
