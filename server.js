
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/note.js");
var Article = require("./models/article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

var PORT = process.env.PORT || 3000;
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
//mongoose.connect("mongodb://localhost/news");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/news");
//mongoose.connect("mongodb://heroku_gfl44np2:n9dg33qgkqtftultnegogsv5gr@ds125060.mlab.com:25060/heroku_gfl44np2");

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes =============================================================

require("./routes/index-routes.js")(app);
require("./routes/html-routes.js")(app);
require("./routes/saved-routes.js")(app);



// Listen on port 3000
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });


