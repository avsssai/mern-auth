const { check } = require("express-validator");

exports.userSignupValidator = [
	check("username")
		.not()
		.isEmpty()
		.withMessage("The username field cannot be empty."),

	check("email")
		.not()
		.isEmpty()
		.withMessage("The Email field cannot be empty.")
		.isEmail()
		.withMessage("Please enter a valid email address."),
	check("password")
		.not()
		.isEmpty()
		.withMessage("The password field cannot be empty.")
		.isLength({ min: 6 })
		.withMessage("Password must be atleast 6 characters long."),
];

exports.signInValidator = [
	check("email")
		.not()
		.isEmpty()
		.withMessage("The Email field cannot be empty.")
		.isEmail()
		.withMessage("Please enter a valid email address."),

	check("password")
		.not()
		.isEmpty()
		.withMessage("The password field cannot be empty.")
		.isLength({ min: 6 })
		.withMessage("The Password must be atleast 6 characters long."),
];
