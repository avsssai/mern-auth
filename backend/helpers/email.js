const nodeMailer = require("nodemailer");

exports.sendEmailWithNodeMailer = (req, res, emailData) => {
	const data = {
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		requireTLS: true,
		auth: {
			user: process.env.MY_EMAIL,
			pass: process.env.MY_PASSWORD,
		},
		tls: {
			ciphers: "SSLv3",
		},
	};
	const transporter = nodeMailer.createTransport(data);
	return transporter
		.sendMail(emailData)
		.then((info) => {
			console.log(`Email has been sent : ${info.response}`);
			return res.json({
				message: `Email has been sent to your email. Follow the instruction to activate your account`,
			});
		})
		.catch((err) => `Problem sending email, ${err}`);
};
