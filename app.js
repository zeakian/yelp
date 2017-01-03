// Import dependencies
var express 		= require("express"),
	app 			= express(),
	mongoose 		= require("mongoose"),
	bodyParser		= require("body-parser"),
	methodOverride 	= require("method-override");

// App config
app.set("view engine", "ejs"); // So we don't need to include ".ejs" file extensions
app.use(express.static("public")); // All static files (css, client-side js, images, etc.) stored in "public" directory
app.use(bodyParser.urlencoded({extended: true})); // So we can retrieve POST data from req.body
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/yelp"); // Connect to database

// Place model
var placeSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Place = mongoose.model("Place", placeSchema);

// // Create dummy data
// Place.create({
// 	name: "Chipotle",
// 	image: "http://www.gannett-cdn.com/-mm-/660d0d8f44dbefade988b94284d0d75b675241d3/c=0-166-4098-3247&r=x404&c=534x401/local/-/media/2016/02/08/USATODAY/USATODAY/635905190687343454-AP-Chipotle-Food-Changes.1.jpg",
// 	description: "Popular mexican spot with burritos and bowls"
// });

// Root / landing
app.get("/", function(req, res) {
	res.render("landing");
});

// Index of places
app.get("/places", function(req, res) {
	// Look up all places in database
	Place.find({}, function(err, places) {
		if (err) {
			console.log(err);
		} else {
			// Render index of places, passing array of places
			res.render("index", {places: places});
		}
	});
});

// GET new place form
app.get("/places/new", function(req, res) {
	res.render("new");
});

// POST new place form
app.post("/places", function(req, res) {
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
app.get("/places/:id", function(req, res) {
	// Look up place in database and render show page
	Place.findById(req.params.id, function(err, place) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.render("show", {place: place});
		}
	});
});

// GET edit place form
app.get("/places/:id/edit", function(req, res) {
	// Look up place in database and redner edit page
	Place.findById(req.params.id, function(err, place) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.render("edit", {place: place});
		}
	});
});

// PUT edit place form
app.put("/places/:id", function(req, res) {
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

// Delete place
app.delete("/places/:id", function(req, res) {
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

// Start server
app.listen(3000, function() {
	console.log("Yelp server listening on port 3000");
});