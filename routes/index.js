const express = require("express");

const userRouter = require("./user-router");
const favoriteRouter = require("./favorite-routes");
const router = express.Router();

router.use("/user", userRouter);
router.use("/favorite", favoriteRouter);
module.exports = router;
