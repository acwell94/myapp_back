const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET_KEY;
const refresh = process.env.JWT_REFRESH_KEY;

const generateAccessToken = (email, nickname) => {
  const token = jwt.sign({ email, nickname }, secret, {
    expiresIn: "1h",
    algorithm: "HS256",
  });
  return token;
};

const generateRefreshToken = (email, nickname) => {
  const refreshToken = jwt.sign({ email, nickname }, refresh, {
    expiresIn: "14d",
    algorithm: "HS256",
  });
  return refreshToken;
};

module.exports = { generateAccessToken, generateRefreshToken };
