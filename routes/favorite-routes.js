const express = require("express");
const { favoriteController } = require("../controller");
const { verifyToken } = require("../middleware/check-auth");
const router = express.Router();

router.get(
  "/getLikeCountByPerfumeId",
  favoriteController.getLikeCountByPerfumeId
);
router.use(verifyToken);

module.exports = router;
