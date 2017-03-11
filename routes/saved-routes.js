

var portfolioController = require('../controllers/saved.js');

module.exports = function(app){

app.get("/articles/:id", portfolioController.grabArticle);
app.get("/articles/:id", portfolioController.createNote);

} 
