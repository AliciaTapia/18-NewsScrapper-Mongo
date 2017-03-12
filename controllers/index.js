
// Requiring our Note and Article models
var Note = require("../models/note.js");
var Article = require("../models/article.js");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");

module.exports = {
    // A GET request to scrape the echojs website
    scrape: function(req, res) {
        // First, we grab the body of the html with request
        request("http://www.elnorte.com/", function(error, response, html) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
            // Now, we grab every h2 within an article tag, and do the following:
            $("div.mdl.n.x1.y1.ic_container").each(function(i, element) {

                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this).find("h1").text();
                result.link = $(this).find("div.caption h1 .ligaonclick").attr("href");
                //result.imgLink = $(this).find("script").find("img").attr("src");

                // Using our Article model, create a new entry
                // This effectively passes the result object to the entry (and the title and link)
                var entry = new Article(result);

                // Now, save that entry to the db
                entry.save(function(err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    // Or log the doc
                    else {
                        res.json(doc);
                        //console.log(doc);
                    }
                });

            });
        });
        // Tell the browser that we finished scraping the text
        res.send("Scrape Complete");
    },


// This will get the articles we scraped from the mongoDB
 articles: function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
}


}
