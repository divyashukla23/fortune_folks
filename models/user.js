const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
	},
	mobileNo: {
		type: String,
		unique: true,
	},
	verified: {
		type: Boolean,
		default: false,
	},
	foodDonated: {
		type: Number,
		default: 0,
	},
	foodRequested: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model("User", userSchema);
