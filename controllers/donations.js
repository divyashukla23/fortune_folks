const Donation = require("../models/donations");
const User = require("../models/user");
const Address = require("../models/address");
const donations = require("../models/donations");

// Adds a donation by a user to the databasee
exports.addDonation = async (req, res) => {
	//Getting the user who donated
	const user = (await req.user)[0];

	const address = new Address({
		addressLine1: req.body.addLine1,
		addressLine2: req.body.addLine2,
		city: req.body.city,
		location: {
			type: "Point",
			coordinates: [req.body.latitude, req.body.longitude],
		},
	});
	try {
		const savedAddr = await address.save();
		//Now creating the donation
		const donation = new Donation({
			userId: user._id,
			pickAddress: savedAddr._id,
			quantity: req.body.quantity,
			description: req.body.description,
		});
		const savedDon = await donation.save();
		//todo: Make an donation listing page and redirect there
		res.redirect("/donations");
	} catch (err) {
		console.log("Internal Server Error");
		//Redirect error page code goes here
	}
};

// Gets all the donations
exports.getDonations = async (req, res) => {
	const data = await Donation.find({ isAvailable: true })
		.populate("userId")
		.populate("pickAddress")
		.sort({ createdOn: "asc" });
	// TO-DO
	// Should implement more optimal solution for this loop as this increases loading time of page when DB is large.
	for (let i = 0; i < data.length; i++) {
		let temp = data[i].userId;
		let temp2 = data[i].pickAddress;
		data[i]["firstname"] = temp.firstName;
		data[i]["lastname"] = temp.lastName;
		data[i]["mobileno"] = temp.mobileNo;
		data[i]["time"] = date_and_time(data[i].createdOn);
		data[i]["address"] = temp2.addressLine1 + " " + temp2.addressLine2 + " " + temp2.city;
		data[i]["location"] = temp2.location.coordinates[0] + "," + temp2.location.coordinates[1];
	}
	const user = await req.user;
	let isAuth = false;
	if (user) {
		isAuth = true;
	}
	res.render("donations", { data: data, isAuth: isAuth });
};

exports.getDonationsByUser = async (req, res) => {
	const user = (await req.user)[0];
	const data = await Donation.find({ isAvailable: true, userId: user._id })
		.populate("userId")
		.populate("pickAddress")
		.sort({ createdOn: "asc" });
	for (let i = 0; i < data.length; i++) {
		let temp = data[i].userId;
		let temp2 = data[i].pickAddress;
		data[i]["firstname"] = temp.firstName;
		data[i]["lastname"] = temp.lastName;
		data[i]["mobileno"] = temp.mobileNo;
		data[i]["time"] = date_and_time(data[i].createdOn);
		data[i]["address"] = temp2.addressLine1 + " " + temp2.addressLine2 + " " + temp2.city;
		data[i]["location"] = temp2.location.coordinates[0] + "," + temp2.location.coordinates[1];
	}
	return data;
};

exports.deleteDonation = async (req, res) => {
	const donationID = req.params.id;
	const user = (await req.user)[0];
	//Delete the donation
	try {
		await Donation.findOneAndUpdate(
			{ _id: donationID, userId: user._id },
			{ isAvailable: false }
		);
		res.redirect("/dashboard");
	} catch (error) {
		res.redirect("/error404");
	}
};

exports.findNearbyDonations = async (req, res) => {
	const long = req.body.latitude;
	const latt = req.body.longitude;
	const maxDis = req.body.maxDistance;
	const quantity = req.body.quantity;
	const data = await Donation.find({
		isAvailable: true,
		quantity: { $gt: quantity },
	})
		.populate("userId")
		.populate({
			path: "pickAddress",
			match: {
				location: {
					$near: {
						$maxDistance: maxDis * 1000,
						$geometry: {
							type: "Point",
							coordinates: [long, latt],
						},
					},
				},
			},
		});

	for (let i = 0; i < data.length; i++) {
		let temp = data[i].userId;
		let temp2 = data[i].pickAddress;
		if (!temp2) continue;
		data[i]["firstname"] = temp.firstName;
		data[i]["lastname"] = temp.lastName;
		data[i]["mobileno"] = temp.mobileNo;
		data[i]["time"] = date_and_time(data[i].createdOn);
		data[i]["address"] = temp2.addressLine1 + " " + temp2.addressLine2 + " " + temp2.city;
		data[i]["location"] = temp2.location.coordinates[0] + "," + temp2.location.coordinates[1];
	}
	const user = await req.user;
	let isAuth = false;
	if (user) {
		isAuth = true;
	}
	res.render("donations", { data: data, isAuth: isAuth });
};
/////////////////////////////////////////////////
///////////// Helper Methods ///////////////////
////////////////////////////////////////////////

function date_and_time(postedTime) {
	var postedTime = new Date(postedTime);
	var diffTime = Math.abs(Date.now() - postedTime);
	var diffSec = Math.ceil(diffTime / 1000);
	if (diffSec <= 59) {
		return "Less than a Minute";
	} else if (diffSec >= 60 && diffSec < 3600) {
		return Math.floor(diffSec / 60) + "mins ";
	} else if (diffSec >= 3600 && diffSec < 86400) {
		return Math.floor(diffSec / 3600) + "hours " + Math.floor((diffSec % 3600) / 60) + "mins ";
	} else {
		return "More than 24 hours";
	}
}
