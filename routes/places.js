// **************************
// Routes for Places
// **************************

// Import dependencies
var express = require("express"),
	router 	= express.Router(),
	Place 	= require("../models/place");

// Index of places
router.get("/", function(req, res) {
	// Look up all places in database
	Place.find({}, function(err, places) {
		if (err) {
			console.log(err);
		} else {
			// Render index of places, passing array of places
			res.render("places/index", {places: places});
		}
	});
});

// GET new place form
router.get("/new", function(req, res) {
	res.render("places/new");
});

// POST new place form
router.post("/", function(req, res) {
	// Update database and redirect to places index
	Place.create({
		name: req.body.name,
		image: req.body.image,
		description: req.body.description
	}, function(err, place) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.redirect("/places");
		}
	});
});

// Show place
router.get("/:id", function(req, res) {
	// Look up place in database and populate its reviews, then render show page
	Place.findById(req.params.id).populate("reviews").exec(function(err, place) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.render("places/show", {place: place});
		}
	});
});

// GET edit place form
router.get("/:id/edit", function(req, res) {
	// Look up place in database and redner edit page
	Place.findById(req.params.id, function(err, place) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.render("places/edit", {place: place});
		}
	});
});

// PUT edit place form
router.put("/:id", function(req, res) {
	// Update database and redirect to show page
	Place.findByIdAndUpdate(req.params.id, req.body, function(err, place) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.redirect("/places/" + req.params.id);
		}
	});
});

// DELETE place
router.delete("/:id", function(req, res) {
	// Remove from database and redirect to places index
	Place.findByIdAndRemove(req.params.id, function(err, place) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.redirect("/places");		
		}
	});
});

module.exports = router;