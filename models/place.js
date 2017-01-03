// **************************
// Model for Place
// **************************

// Import dependencies
var mongoose = require("mongoose");

// Create schema and compile into model
var placeSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review"
		}
	]
});

module.exports = mongoose.model("Place", placeSchema);