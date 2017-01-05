// **************************
// Model for User
// **************************

// Import dependencies
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// Create schema and compile into model
var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	places: [
		{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Place"
		}
	],
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review"
		}
	]
});

userSchema.plugin(passportLocalMongoose); // salts/hashes password (so w don't have to do so manually with something like bcrypt) and provides additional auth functionality (e.g., User.register())

module.exports = mongoose.model("User", userSchema);