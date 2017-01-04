// **************************
// Model for Review
// **************************

// Import dependencies
var mongoose = require("mongoose");

// Create schema and compile into model
var reviewSchema = new mongoose.Schema({
	rating: Number,
	content: String,
	author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Review", reviewSchema);