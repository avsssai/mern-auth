const express = require("express");
const authController = require("../controllers/authController");
const { runValidation } = require("../validators/index");
const {
	userSignupValidator,
	signInValidator,
} = require("../validators/authValidation");

const router = express.Router();

router.post(
	"/signup",
	userSignupValidator,
	runValidation,
	authController.signup
);

router.post("/account-activation", authController.accountActivation);

router.post("/signin", signInValidator, runValidation, authController.signIn);

module.exports = router;
