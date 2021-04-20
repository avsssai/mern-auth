const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { sendEmailWithNodeMailer } = require("../helpers/email");
const router = require("../routes/auth");
// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = (req, res) => {
	const { username, email, password } = req.body;

	// check if the user already exists
	User.findOne({ email }).exec((err, user) => {
		if (user) {
			return res.status(400).json({
				errors: [{ msg: "Email is taken." }],
			});
		}
		// IF THE USER DOES NOT EXIST
		const token = jwt.sign(
			{ username, email, password },
			process.env.JWT_ACCOUNT_ACTIVATION,
			{ expiresIn: "10m" }
		);

		// send the email to the user
		const emailData = {
			from: process.env.MY_EMAIL,
			to: email,
			subject: "Account activation link.",
			html: `
			<h1>Please use the below link to activate your account.</h1>
			<p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
			<hr />
			<p>This email may contain sensitive information.</p>
			<p>${process.env.CLIENT_URL}</p>
		`,
		};

		sendEmailWithNodeMailer(req, res, emailData);

		// sgMail
		// 	.send(emailData)
		// 	.then((sent) => {
		// 		console.log("Email sent!", sent);
		// 		res.json({
		// 			message: `Email has been sent to ${email},
		// 		please follow instructions to activate your account.`,
		// 		});
		// 	})
		// 	.catch((err) => console.log(err));
	});
};

exports.accountActivation = (req, res) => {
	const { token } = req.body;
	if (token) {
		jwt.verify(
			token,
			process.env.JWT_ACCOUNT_ACTIVATION,
			function (err, decoded) {
				if (err) {
					console.log("JWT VERIFY IN ACCT ACTIVATION ERR", err);
					return res.status(401).json({
						errors: [
							{ msg: "Token Expired, please signin again." },
						],
					});
				}
				const { username, email, password } = jwt.decode(token);
				const user = new User({ username, email, password });
				user.save((err, user) => {
					if (err) {
						console.log("ERROR SAVING USER INTO DB", err);
						res.status(401).json({
							errors: [
								{
									msg:
										"Error saving user into the database, try signing in again.",
								},
							],
						});
					}
					res.json({
						message: "Signup success. Please Sign In",
					});
				});
			}
		);
	} else {
		res.json({
			errors: [{ msg: "Something went wrong, please try again." }],
		});
	}
};

exports.signIn = (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email }).exec((err, user) => {
		// IF THE USER DOES NOT EXIST
		if (err || !user) {
			//if there is no user
			console.log("NO USER WITH THE EMAIL.", err);
			return res.status(400).json({
				errors: [
					{
						msg:
							"User with that email does not exist, please Signup.",
					},
				],
			});
		}

		// IF THE USER EXISTS
		// authenticate user
		//wrong password
		if (!user.authenticate(password)) {
			return res.status(400).json({
				errors: [{ msg: "Email or password is incorrect." }],
			});
		}

		// if authentication successful
		// generate a token and send to client
		token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});
		const { _id, username, email, role } = user;
		return res.json({
			token,
			user: {
				_id,
				username,
				email,
				role,
			},
		});
	});
};

// exports.signup = (req, res) => {
// 	// get the details from req body
// 	const { username, email, password } = req.body;

// 	//check if the email already exists
// 	User.findOne({ email: email }).exec((err, user) => {
// 		if (user) {
// 			return res.status(400).json({
// 				error: "Email is taken.",
// 			});
// 		}
// 	});

// 	let newUser = new User({ username, email, password });
// 	newUser
// 		.save()
// 		.then(() => {
// 			res.json({
// 				message:
// 					"The new user has been created successfully, Please sign in",
// 				email: newUser.email,
// 			});
// 		})
// 		.catch((err) => {
// 			console.log("SIGNUP ERROR", 400);
// 			res.status(400).json({
// 				message: "An error occurred while creating the user.",
// 				error: err,
// 			});
// 		});
// };
