// **************************
// Routes for Reviews
// **************************

// Import dependencies
var express 	= require("express")
	router 		= express.Router({mergeParams: true}), // need to use mergeParams: true whenever trying to pass a parameter (e.g., :id) coming from app.use prepended string
	Place 		= require("../models/place"),
	Review 		= require("../models/review"),
	middleware 	= require("../middleware");

// GET new review form
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res) {
	// Look up place in database, add new review, then redirect to updated show page
	
	// 1. Look up place using id
	Place.findById(req.params.id).populate("reviews").exec(function(err, place) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/places/" + req.params.id);
		} else {
			// 2. Create new review
			var newReview = new Review({
				place: place,
				rating: req.body.rating,
				content: req.body.content,
				author: {
					id: req.user._id,
					username: req.user.username
				}
			});

			// 3. Save new review to reviews collection
			newReview.save(function(err, review) {
				if (err) {
					console.log(err);
					req.flash("error", err.message);
					res.redirect("/places/" + req.params.id);
				} else {
					// 4. Link new review to place by reference
					place.reviews.push(review);

					// 5. Update the place's overall rating
					place.rating = updateRating(place);
					
					// 6. Save place with updated review reference and rating
					place.save(function(err, updatedPlace) {
						if (err) {
							console.log(err);
							req.flash("error", err.message);
							res.redirect("/places/" + req.params.id);
						} else {
							// 7. Link new review to user by reference and save user
							req.user.reviews.push(review);
							req.user.save(function(err, savedUser) {
								// 7. Redirect to show page updated with new review and rating
								req.flash("success", "Review added for " + updatedPlace.name + "!");
								res.redirect("/places/" + req.params.id);
							});
						}
					});
				}
			});
		}
	});
});

// The below logic requires 4 database calls, whereas, the above only requires 3
// router.post("/", middleware.isLoggedIn, function(req, res) {
// 	// Look up place in database, add review, then redirect to updated show page
	
// 	// 1. Look up place using ID
// 	Place.findById(req.params.id, function(err, place) {
// 		if (err) {
// 			// 2.a. If error in looking up place, log error
// 			console.log(err);
// 			res.send(err);
// 		} else {
// 			// 2.b. If successfully looked up place, create new review
// 			Review.create(req.body, function(err, review) {
// 				if (err) {
// 					// 3.a. If error in creating new review, log error
// 					console.log(err);
// 					res.send(err);
// 				} else {
// 					// 3.b. If successfully created new review, add username and id to review
// 					review.author.username = req.user.username;
// 					review.author.id = req.user._id;
// 					review.save(function(err, savedReview) {
// 						if (err) {
// 							// 4.a. If error in saving author info, log error
// 							console.log(err);
// 							res.send(err);
// 						} else {
// 							// 4.b. If successfully saved review with author info, connect review to place by reference
// 							place.reviews.push(savedReview);

// 							// 5. Save updated place and redirect to show page
// 							place.save(function(err, savedPlace) {
// 								if (err) {
// 									console.log(err);
// 									res.send(err);
// 								} else {
// 									res.redirect("/places/" + req.params.id);
// 								}
// 							});
// 						}
// 					});		
// 				}
// 			});
// 		}
// 	});
// });

// GET edit review form
router.get("/:review_id/edit", middleware.checkReviewAuthor, function(req, res) {
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
router.put("/:review_id", middleware.checkReviewAuthor, function(req, res) {
	// Update review database, update place's overall rating, then redirect to place show page
	Review.findByIdAndUpdate(req.params.review_id, req.body, function(err, review) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/places/" + req.params.id);
		} else {
			// Update the place's overall rating
			Place.findById(req.params.id).populate("reviews").exec(function(err, place) {
				if (err) {
					console.log(err);
				} else {
					place.rating = updateRating(place);
					place.save();
				}
			});

			// Redirect to show page
			req.flash("success", "Edited review!");
			res.redirect("/places/" + req.params.id);
		}
	});
});

// DELETE review
router.delete("/:review_id", middleware.checkReviewAuthor, function(req, res) {
	// Remove review from Reviews database, then redirect to place show page (reference to deleted comment remains in Places database)
	Review.findByIdAndRemove(req.params.review_id, function(err, review) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/places/" + req.params.id);
		} else {
			// Update the place's overall rating
			Place.findById(req.params.id).populate("reviews").exec(function(err, place) {
				if (err) {
					console.log(err);
				} else {
					place.rating = updateRating(place);
					place.save();
				}
			});

			req.flash("success", "Deleted review!");
			res.redirect("/places/" + req.params.id);
		}
	});
});

// Update place's overall rating - helper function (does not save to database - need to save manually)
function updateRating(place) {
	var overallRating = 0;

	place.reviews.forEach(function(e) {
		overallRating += e.rating;
	});

	overallRating = overallRating / place.reviews.length;
	
	return overallRating;
}

module.exports = router;

























