const express = require("express");
const {sendForgotPasswordLink, getForgotPasswordView, getResetPasswordView, ResetPassword } = require("../controllers/passwordController");
const router = express.Router();


// password/forgot-password
router.route("/forgot-password")
.get(getForgotPasswordView)
.post(sendForgotPasswordLink)

// /password/reset-password/:userId/:token
router.route("/reset-password/:userId/:token")
.get(getResetPasswordView)
.post(ResetPassword)

module.exports = router;