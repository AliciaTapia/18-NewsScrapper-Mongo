/*Whenever a user visits your site, the app will scrape stories from a news outlet of your choice. The data should at least include a link to the story and a headline, but feel free to add more content to your database (photos, bylines, and so on).
Use Cheerio to grab the site content and Mongoose to save it to your MongoDB database.

All users can leave comments on the stories you collect. They should also be allowed to delete whatever comments they want removed. All stored comments should be visible to every user.

You'll need to use Mongoose's model system to associate comments with particular articles.*/


// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");


// Initialize Express
var app = express();


// Set up a static folder (public) for our web app (so it will dosplay our index.html)
app.use(express.static("public"));

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
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
  $("a.ligaonclick").each(function(i, element) {

    // Save the text of the h4-tag as "title"
    var title = $(this).text();

    // Find the h4 tag's parent a-tag, and save it's href value as "link"
    var link = $(element).parent().attr("href");

    // For each h4-tag, make an object with data we scraped and push it to the result array
    result.push({
      title: title,
      link: link
    });

  });

 
  $("div.foto").each(function(i, element) {

    /* Cheerio's find method will "find" the first matching child element in a parent.
     *    We start at the current element, then "find" its first child a-tag.
     *    Then, we "find" the lone child img-tag in that a-tag.
     *    Then, .attr grabs the imgs src value.
     * So: <figure>  ->  <a>  ->  <img src="link">  ->  "link"  */
    var imgLink = $(element).find("a").find("img").attr("src");

    // Push the image's URL (saved to the imgLink var) into the result array
    result.push({ Link: imgLink });
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


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});


