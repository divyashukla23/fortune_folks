const User = require("../models/user");
const bcrypt = require("bcryptjs");

const Mailer = require("./mailer.js");
const OtpManager = require("./otp.js");

//User registration

exports.register = async (req, res) => {
	//checking if an user already exists with this particular email
	const tempUser = await User.findOne({ email: req.body.email });
	if (tempUser) {
		res.render("joinUs", { error: "Email already used" });
		return;
	}
	//checking if an user already exists with this particular mobileNo
	const tempUser2 = await User.findOne({ mobileNo: req.body.mobileNo });
	if (tempUser2) {
		res.render("joinUs", { error: "Mobile Number already used" });
		return;
	}
	try {
		//Generating a hash for the user password
		const saltRounds = 10;
		const hashPass = await bcrypt.hash(req.body.password, saltRounds);

		//Creating the user object
		const user = new User({
			firstName: req.body.fname,
			lastName: req.body.lname,
			password: hashPass,
			email: req.body.email,
			mobileNo: req.body.mobileNo,
			verified: false,
		});
		await Mailer.sendMail(user.email);
		await OtpManager.send_otp(user.mobileNo);
		//Saving the user details in database
		const savedData = await user.save();
		res.redirect("/login");
	} catch (err) {
		res.redirect("/error");
	}
};

exports.update = async (req, res) => {
	const user = (await req.user)[0];
	const savedUser = await User.findById(user._id);
	savedUser.firstName = req.body.fname;
	savedUser.lastName = req.body.lname;
	savedUser.email = req.body.email;
	savedUser.mobileNo = req.body.mobileNo;
	await savedUser.save();
	if (req.body.otp) {
		OtpManager.verify_otp(user.mobileNo, req.body.otp);
	}
	res.redirect("/dashboard");

	//const updatedUser = await User.findOneAndUpdate({ _id: user._id }, req.body, { new: true });
};
