// Import frameworks
var express 		= require("express"),
	app 			= express(),
	mongoose 		= require("mongoose"),
	bodyParser		= require("body-parser"),
	methodOverride 	= require("method-override");

// Import models
var Place 	= require("./models/place"),
	Review 	= require("./models/review");

// Import routes
var indexRoutes		= require("./routes/index"),
	placeRoutes		= require("./routes/places"),
	reviewRoutes 	= require("./routes/reviews");

// App config
app.set("view engine", "ejs"); // So we don't need to include ".ejs" file extensions
app.use(express.static("public")); // All static files (css, client-side js, images, etc.) stored in "public" directory
app.use(bodyParser.urlencoded({extended: true})); // So we can retrieve POST data from req.body
app.use(methodOverride("_method"));

// Routes
app.use("/", indexRoutes);
app.use("/places", placeRoutes);
app.use("/places/:id/reviews", reviewRoutes);

// Connect to database
mongoose.connect("mongodb://localhost/yelp");

// Start server
app.listen(3000, function() {
	console.log("Yelp server listening on port 3000");
});