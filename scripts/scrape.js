// scrape script
// =============

// Require request and cheerio, making scrapes possible
var request = require("request");
var cheerior = require("cheerio");

var scrape = function (cb) {

    request("http://www.grandorksherald.com", function(err, res, body){

        var $ = cheerio.load(body);

        var article = [];
        $(".article-teaser").each(function(i, element){

            var art = $(this).children(".article-title").text().trim();
            var sum = $(this).children(".article-teaser").text().trim();

            if(art && sum){
                var artNeat = art.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataToAdd = {
                    article: artNeat,
                    summary: sumNeat
                };

                articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
};

module.exports = scrape;