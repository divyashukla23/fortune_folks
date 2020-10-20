const client = require("twilio")('AC696ff3e5d19db847511a819be85ead25' ,
'a35810afa3a8eeb63e50aadd5a98ff48');
const OTP = require("../models/otp");
const User = require("../models/user");

/*
    Send OTP to a particular number
*/
exports.send_otp = async (mobileNo) => {
	//Generating a random 6 digit random OTP
	const ranOTP = Math.floor(100000 + Math.random() * 900000);
	const ttx = 5 * 60 * 1000; // time to expire is 5 minutes

	//Creating a new OTP model
	const otp = new OTP({
		mobileNo: mobileNo,
		otp: ranOTP,
		createdOn: Date.now(),
		expiresOn: Date.now() + ttx,
	});
	try {
		//Sending SMS to client
		result = await client.messages.create({
			body: "Your verification code is :" + ranOTP,
			from: "+12702296922",
			to: otp.mobileNo,
		});

		//Delete any past otp data with this number
		await OTP.deleteMany({ mobileNo: mobileNo });

		//Saving new OTP in database
		const savedOTP = otp.save();

		// res.status(200).json({
		// 	message: "Otp Sended successfully",
		// 	response: result,
		// 	sended: await savedOTP,
		// });
	} catch (err) {
		console.log(err);
	}
};

//Verifies the OTP and
exports.verify_otp = async (mobileNo, otp) => {
	try {
		const otp = await OTP.findOne({
			mobileNo: mobileNo,
			otp: otp,
		});

		if (otp) {
			const currTime = Date.now();
			const expiryTime = new Date(otp.expiresOn).getTime();
			if (currTime < expiryTime) {
				//Find and update user verfication status with this mobileNo
				const result = await User.findOneAndUpdate(
					{ mobileNo: req.body.mobileNo },
					{ verified: true },
					{ useFindAndModify: false }
				);
				if (result != null) {
					return true;
				} else {
					return false;
				}
			}
		}
		return true;
	} catch (err) {
		return false;
	}
};
