// **************************
// Middleware
// **************************

var Place 	= require("../models/place"),
	Review 	= require("../models/review");

var middlewareObj = {};

// Check if user is logged in, if yes, allow them to access the page, else redirect to login form
middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/login");
	}
};

// Check if user logged in, and if user is author of place
middlewareObj.checkPlaceAuthor = function(req, res, next) {
	if (req.isAuthenticated()) {
		Place.findById(req.params.id, function(err, place) {
			if (err) {
				console.log(err);
			} else {
				console.log(place.author);
				console.log(req.user._id);

				if (place.author.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});	
	} else {
		res.redirect("back");
	}	
};

middlewareObj.checkReviewAuthor = function(req, res, next) {
	if (req.isAuthenticated()) {
		Review.findById(req.params.review_id, function(err, review) {
			if (err) {
				console.log(err);
			} else {
				if (review.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}

module.exports = middlewareObj;