const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
	mobileNo: {
		type: String,
		required: true,
	},
	otp: {
		type: Number,
		required: true,
	},
	createdOn: {
		type: Date,
		default: Date.now(),
	},
	expiresOn: {
		type: Date,
	},
});
module.exports = mongoose.model("OTP", otpSchema);
