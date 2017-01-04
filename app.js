// Import basic frameworks
var express 		= require("express"),
	app 			= express(),
	mongoose 		= require("mongoose"),
	bodyParser		= require("body-parser"),
	methodOverride 	= require("method-override");

// Import auth frameworks
var passport 		= require("passport"), // auth middleware for Node
	LocalStrategy 	= require("passport-local"), // Passport's strategy for local (i.e., username/password) auth
	expressSession	= require("express-session"); // allow user to stay logged in with cookie

// Import models
var Place 	= require("./models/place"),
	Review 	= require("./models/review"),
	User 	= require("./models/user");

// Import routes
var indexRoutes		= require("./routes/index"),
	placeRoutes		= require("./routes/places"),
	reviewRoutes 	= require("./routes/reviews");

// Connect to database
mongoose.connect("mongodb://localhost/yelp");

// App config
app.set("view engine", "ejs"); // So we don't need to include ".ejs" file extensions
app.use(express.static(__dirname + "/public")); // All static files (css, client-side js, images, etc.) stored in "public" directory
app.use(bodyParser.urlencoded({extended: true})); // So we can retrieve POST data from req.body
app.use(methodOverride("_method")); // HTML only supports GET and POST request; methodOverride allows support for PUT, DELETE, etc.

// Auth config
app.use(expressSession({
	secret: "JoJo is a boss", // cookie encrypted using this phrase as key
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Create middleware that passes the curent user (req.user) as a variable called "user" to our EJS templates (so we can display the correct login/logout buttons in the header)
// When defined as "app.use", this middleware will run for all of our routes (otherwise, we'd have pass through req.user on each route manually)
// Must come after auth config
app.use(function(req, res, next) { 
	res.locals.user = req.user;
	next();
});

// Routes config
app.use("/", indexRoutes);
app.use("/places", placeRoutes);
app.use("/places/:id/reviews", reviewRoutes);

// Start server
app.listen(3000, function() {
	console.log("Yelp server listening on port 3000");
});