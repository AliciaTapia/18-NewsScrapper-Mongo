
//  Index routes will handle the scrapping and saving of 
//  the information(the object holding the link and title)

var portfolioController = require('../controllers/index.js');

module.exports = function(app){

app.get("/scrape", portfolioController.scrape);
app.get("/articles", portfolioController.articles);


} 
