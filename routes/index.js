// **************************
// Routes for Root and Auth
// **************************

// Import dependencies
var express = require("express"),
	router 	= express.Router();

// Root / landing
router.get("/", function(req, res) {
	res.render("landing");
});

module.exports = router;