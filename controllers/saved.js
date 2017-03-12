// Requiring our Note and Article models
var Note = require("../models/note.js");
var Article = require("../models/article.js");
var request = require("request");
var cheerio = require("cheerio");

module.exports = {

    createNote: function(req, res) {
        var newNote = new Note(req.body);

        // And save the new note the db
        newNote.save(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise
            else {
                // Use the article id to find and update it's note
                Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
                    // Execute the above query
                    .exec(function(err, doc) {
                        // Log any errors
                        if (err) {
                            console.log(err);
                        } else {
                            // Or send the document to the browser
                            res.send(doc);
                        }
                    });
            }
        });
    },


	grabArticle: function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        Article.findOne({ "_id": req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            // now, execute our query
            .exec(function(error, doc) {
                // Log any errors
                if (error) {
                    console.log(error);
                }
                // Otherwise, send the doc to the browser as a json object
                else {
                    res.json(doc);
                }
            });
    }
}
