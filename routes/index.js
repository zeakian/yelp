// **************************
// Routes for Root, Profile and Auth
// **************************

// Import dependencies
var express 	= require("express"),
	router 		= express.Router(),
	passport 	= require("passport"),
	User 		= require("../models/user");

// Root / landing
router.get("/", function(req, res) {
	res.render("index/landing");
});

// User profile
router.get("/user/:user_id", function(req, res) {
	// Look up user in database
	User.findById(req.params.user_id).populate("places").populate("reviews").exec(function(err, userProfile) {
		if (err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.render("index/profile", {userProfile: userProfile});
		}
	});
});

// **************************
// Authentication
// **************************

// GET signup form
router.get("/signup", function(req, res) {
	// If user already logged in, redirect to places index
	if (req.user) {
		res.redirect("/places");
	} else {
		res.render("index/signup");
	}
});

// POST signup form
router.post("/signup", function(req, res) {
	// 1. Create new user with just a username (by convention, password will be created later w/ hash/salt)
	var newUser = new User({ username: req.body.username });

	// 2. Sign up the new user, providing the password which will be hashed
	// The "register" method is added to User by passport-local-mongoose plugin - basically creates a new user in the database with provided username and password (and salts/hashes the password)
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			// 3.a. If error in signing up the new user, redirect back to sign up page
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/signup");
		} else {
			// 3.b. If succesfully signed up new user, log the user in and redirect to places index
			// passport.authenticate takes one argument - the auth strategy (in this case, local)
			// when passport.authenticate is called, it tries to log in the user using the req.body info
			passport.authenticate("local")(req, res, function() {
				req.flash("success", "Welcome to Yelp, " + user.username + "!");
				res.redirect("/places");
			});
		}
	});
});

// GET login form
router.get("/login", function(req, res) {
	// If user already logged in, redirect to places index
	if (req.user) {
		res.redirect("/places");
	} else {
		res.render("index/login");
	}
});

// POST login form
// Use passport.auth middleware - when request is received, middleware will try to auth user (using username and password in req.body), and redirect to places index if successful
router.post("/login", passport.authenticate("local", {
	successRedirect: "/places",
	failureRedirect: "/login"
}), function(req, res) {
	// Should never reach here	
});

// Logout
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

module.exports = router;