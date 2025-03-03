const express = require("express");
const { userController } = require("../controller");
const { verifyToken } = require("../middleware/check-auth");
const router = express.Router();

router.post("/email/signup", userController.signUpForEmail);
router.post("/email/signin", userController.signInForEmail);
router.post("/logout", userController.logout);

router.use(verifyToken);
router.get("/", userController.test);
module.exports = router;
