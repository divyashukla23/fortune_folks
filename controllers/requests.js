const User = require("../models/user");
const Address = require("../models/address");
const Request = require("../models/requests");

exports.addRequest = async (req, res) => {
	//Getting the user who requested
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
		//Now creating the request
		const request = new Request({
			userId: user._id,
			pickAddress: savedAddr._id,
			quantity: req.body.quantity,
			description: req.body.description,
		});
		const savedDon = await request.save();
		//todo: Make an request listing page and redirect there
		res.redirect("/requests");
	} catch (err) {
		console.log("Internal Server Error");
		//Redirect error page code goes here
	}
};

exports.getRequests = async (req, res) => {
	const data = await Request.find({ isAvailable: true })
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
	res.render("requests", { data: data, isAuth: isAuth });
};

exports.getRequestsByUser = async (req, res) => {
	const user = (await req.user)[0];
	const data = await Request.find({ userId: user._id });
	data.sort((a, b) => {
		var t1 = new Date(a.createdOn);
		var t2 = new Date(b.createdOn);
		return t1.getTime() < t2.getTime();
	});
	// TO-DO
	// Should implement more optimal solution for this loop as this increases loading time of page when DB is large.
	for (let i = 0; i < data.length; i++) {
		let temp = await User.findById(data[i].userId);
		let temp2 = await Address.findById(data[i].pickAddress);
		data[i]["firstname"] = temp.firstName;
		data[i]["lastname"] = temp.lastName;
		data[i]["mobileno"] = temp.mobileNo;
		data[i]["time"] = date_and_time(data[i].createdOn);
		data[i]["address"] = temp2.addressLine1 + " " + temp2.addressLine2 + " " + temp2.city;
		data[i]["location"] = temp2.location.coordinates[0] + "," + temp2.location.coordinates[1];
	}
	return data;
};

exports.findNearbyRequests = async (req, res) => {
	const long = req.body.latitude;
	const latt = req.body.longitude;
	const maxDis = req.body.maxDistance;
	const quantity = req.body.quantity;
	const data = await Request.find({ isAvailable: true, quantity: { $lt: quantity } })
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
	res.render("requests", { data: data, isAuth: isAuth });
};
exports.deleteRequest = async (req, res) => {
	const requestID = req.params.id;
	const user = (await req.user)[0];
	//Delete the donation
	try {
		await Request.findOneAndUpdate(
			{ _id: requestID, userId: user._id },
			{ isAvailable: false }
		);
		res.redirect("/dashboard");
	} catch (error) {
		res.redirect("/error404");
	}
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
