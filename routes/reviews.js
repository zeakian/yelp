// **************************
// Routes for Reviews
// **************************

// Import dependencies
var express = require("express")
	router 	= express.Router({mergeParams: true}), // need to use mergeParams: true whenever trying to pass a parameter (e.g., :id) coming from app.use prepended string
	Place 	= require("../models/place"),
	Review 	= require("../models/review");

// GET new review form
router.get("/new", function(req, res) {
	// Look up place in database and render new review form
	Place.findById(req.params.id, function(err, place) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.render("reviews/new", {place: place});
		}
	});
});

// POST new review form
router.post("/", function(req, res) {
	// Look up place in database, add review, then redirect to updated show page
	
	// 1. Look up place using ID
	Place.findById(req.params.id, function(err, place) {
		if (err) {
			// 2.a. If error in looking up place, log error
			console.log(err);
			res.send(err);
		} else {
			// 2.b. If successfully looked up place, create new review
			Review.create(req.body, function(err, review) {
				if (err) {
					// 3.a. If error in creating new review, log error
					console.log(err);
					res.send(err);
				} else {
					// 3.b. If successfully created new review, connect review to the place by reference
					place.reviews.push(review);
					
					// 4. Save updated place and redirect to show page
					place.save(function(err, savedPlace) {
						if (err) {
							console.log(err);
							res.send(err);
						} else {
							res.redirect("/places/" + req.params.id);
						}
					});
				}
			});
		}
	});
});

// GET edit review form
router.get("/:review_id/edit", function(req, res) {
	// Look up place in database, look up review, render edit review page
	Place.findById(req.params.id, function(err, place) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			Review.findById(req.params.review_id, function(err, review) {
				if (err) {
					console.log(err);
					res.send(err);
				} else {
					res.render("reviews/edit", {place: place, review: review});
				}
			});
		}
	});
});

// PUT edit review form
router.put("/:review_id", function(req, res) {
	// Update database, then redirect to place show page
	Review.findByIdAndUpdate(req.params.review_id, req.body, function(err, review) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.redirect("/places/" + req.params.id);
		}
	});
});

// DELETE review
router.delete("/:review_id", function(req, res) {
	// Remove review from Reviews database, then redirect to place show page (reference to deleted comment remains in Places database)
	Review.findByIdAndRemove(req.params.review_id, function(err, review) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.redirect("/places/" + req.params.id);
		}
	});
});

module.exports = router;
























