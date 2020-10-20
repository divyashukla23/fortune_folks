// Todo: Storing Geo coordinates along with address
// Resource 1 :https://mongoosejs.com/docs/geojson.html
// Resource 2 :https://geojson.org/

const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
	addressLine1: {
		type: String,
		required: true,
	},
	addressLine2: {
		type: String,
	},
	city: {
		type: String,
		required: true,
	},

	location: {
		type: {
			type: String,
			enum: ["Point"],
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
});

addressSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Address", addressSchema);
