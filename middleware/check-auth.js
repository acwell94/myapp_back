const jwt = require("jsonwebtoken");
const { GetUserByRefreshToken_model } = require("../model/user-model");

const secret = process.env.JWT_SECRET_KEY;
const refresh = process.env.JWT_REFRESH_KEY;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "토큰이 필요합니다." });
  const token = authHeader.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  jwt.verify(token, secret, async (err, decoded) => {
    if (err && err.name === "TokenExpiredError") {
      console.log("실행");
      if (!refreshToken)
        return res.status(401).json({ message: "refresh token이 필요합니다." });
      try {
        const user = await GetUserByRefreshToken_model(refreshToken);
        if (!user)
          return res
            .status(401)
            .json({ message: "유효하지 않은 refresh token 입니다." });
        jwt.verify(refreshToken, refresh, async (err, decodedRefresh) => {
          if (err)
            return res
              .status(403)
              .json({ message: "refresh token이 만료되었습니다." });
          const newAccessToken = jwt.sign(
            { userId: user.id, email: user.email },
            secret,
            {
              expiresIn: "15m",
            }
          );
          req.user = decodedRefresh;
          req.newAccessToken = newAccessToken;
          next();
        });
      } catch (err) {
        return res.status(500).json({ message: "서버 오류", err });
      }
    } else if (err) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    } else {
      req.user = decoded;
      next();
    }
  });
};
module.exports = { verifyToken };
