const nodemailer = require("nodemailer");
exports.sendMail = async (recieverMail) => {
	const otp = 4532;
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "shashankcs083@gmail.com",
			pass: "just2java",
		},
	});

	var mailOptions = {
		from: "Team Fortune Folks",
		to: recieverMail,
		subject: "Registration Verification on Fortune Folks",
		text: "Your One Time Password is :" + otp,
	};
	const info = await transporter.sendMail(mailOptions);
};
