
// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

var bodyParser = require("body-parser");


// Initialize Express
var app = express();


// Set up a static folder (public) for our web app (so it will dosplay our index.html)
app.use(express.static("./public"));

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "news";
var collections = ["articles"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));


// Routes =============================================================

//require("./routes/home-routes.js")(app);
//require("./routes/html-routes.js")(app);
//require("./routes/saved-routes.js")(app);



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});




/* ==========  Scraper ================ */


// First, tell the console what server2.js is doing
console.log("\n******************************************\n" +
            "Grabbing every article headline and link\n" +
            "from the El Norte website:" +
            "\n******************************************\n");


// Making a request call for nhl.com's homepage
request("http://www.elnorte.com/", function(error, response, html) {

  // Load the body of the HTML into cheerio
  var $ = cheerio.load(html);

  // Empty array to save our scraped data
  var result = [];

  // With cheerio, find each h4-tag with the class "headline-link"
  $("div.mdl.n.x1.y1.ic_container").each(function(i, element) {

    // Save the text of the h4-tag as "title"
    var title = $(this).find("h1").text();

    // Find the h4 tag's parent a-tag, and save it's href value as "link"
    var link = $(this).find("div.caption h1 .ligaonclick").attr('href');
   
    /* Cheerio's find method will "find" the first matching child element in a parent.
     *    We start at the current element, then "find" its first child a-tag.
     *    Then, we "find" the lone child img-tag in that a-tag.
     *    Then, .attr grabs the imgs src value.
     * So: <figure>  ->  <a>  ->  <img src="link">  ->  "link"  */
    var imgLink = $(this).find("script").find("img").attr("src");

// // If this title element had both a title and a link
//       if (title && link) {
//         // Save the data in the scrapedData db
//         db.article.save({
//           title: title,
//           link: link
//           imgLink: imgLink
//         },
//         function(error, saved) {
//           // If there's an error during this query
//           if (error) {
//             // Log the error
//             console.log(error);
//           }
//           // Otherwise,
//           else {
//             // Log the saved data
//             console.log(saved);
//           }
//         });
//       }
  
    // For each h4-tag, make an object with data we scraped and push it to the result array
    result.push({
      title: title,
      link: link,
      imgLink: imgLink
    });

  });

 
 

  // After the program scans each h4.headline-link, log the result
  console.log(result);
});


// /////////////   Routes   ////////////////////

// Route 1
//Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});


// Route 2

// Route 3

