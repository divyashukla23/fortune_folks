const mongoose = require("mongoose");
const User = require("../models/user");

const donationSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	pickAddress: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Address",
		required: true,
	},
	quantity: {
		type: Number,
		default: 1,
	},
	createdOn: {
		type: Date,
		default: Date.now,
	},
	description: {
		type: String,
	},
	isAvailable: {
		type: Boolean,
		default: true,
	},
});

donationSchema.post("save", async (doc) => {
	try {
		const user = await User.findById(doc.userId);
		user.foodDonated = user.foodDonated + 1;
		await user.save();
	} catch (err) {
		throw err;
	}
});
module.exports = mongoose.model("Donation", donationSchema);
