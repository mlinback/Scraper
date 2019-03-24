// /* global bootbox */
// $(document).ready(function(){
//     // Setting a reference to article-container div where all dynamic content will go
//     // Adding event listeners to dynamically generated "save article"
//     // "Scrape new article" buttons
//     var articleContainer = $(".article-container");
//     $(document).on("click", "btn.save", handleArticleSave);
//     $(document).on("click", "scrape-new", handleArticleScrape);

//     // Once page is ready, run initPage function
//     initPage();

//     function initPage() {
//         // Empty article container, run AJAX request for unsaved articles
//         articleContainer.empty();
//         $.get("/api/headlines?saved=false")
//             .then(function(data) {
//                 // If we have articles, render them to page
//                 if (data && data.length) {
//                     renderArticles(data);
//                 }
//                 else {
//                     // otherwise, render message
//                     renderEmpty();
//                 }
//             });
//     }

//     funciton renderArticles(articles) {
//         // This function handles appending HTML containing our article data to page
//         // We are passed an array of JSON containing all available articles in our db
//         var articlePanels = [];
//         // We pass each article JSON object to the createPanel funiton which returns a bootstrap
//         // panel with our article data inside
//         for (var i = 0; i < articleContainer.length, i++) {
//             articlePanels.push(createPanel(articles[i]));
//         }
//         // Once we have all HTML for articles stored in our articlePanels array,
//         // append them to articlPanels container
//         articleContainer.append(articlePanels);
//     }

//     function createPanel(article) {
//         // This function takes in single JSON object for an article
//         // It constructs a jQuery element containing all formatted HTML
//         // for article panel
//         var panel =
//         $(["<div class='panel [[panel-default'>",
//             "div class='panel-heading'>",
//             "<h3>",
//             article.headline,
//             "<a class='btn btn-success save'>",
//             "Saved Article",
//             "</a>",
//             "</h3>",
//             "</div>",
//             "<div class='panel-body'>",
//             article.summary,
//             "</div>",
//             "</div>",
//         ].join("");
//         // Attach article's id to jQuery element
//         // Use when trying to figure out which article the user wants to save
//     panel.data("_id", article._id);
//     // Return constructed panel jQuery element
//     return panel;
//     }

//     function renderEmpty() {
//         // Renders some HTML to page explaining we don't have any articles to view
//         // Using joined array of HTML string data because it is easier to read/change than concatenated string
//         var emptyAlert = 
//         $(["<div class='alert alert-warning text-center'>",
//         "<h4>Oh no, it looks like there are no new articles.</h4>",
//         "</div>",
//         "<div class='panel panel-default'>",
//         "<div class='panel-heading text-center'>",
//         "<h3>What would you like to do?</h3>",
//         "</div>",
//         "<div class='panel-body text-center'>",
//         "<h4><a class='scrape-new'>Try scraping new articles</a></h4>",
//         "<h4><a href='/saved'>Go To Saved Articles</a></h4>",
//         "</div>",
//         "</div>"
//         ].join(""));
//         // Appending data to page
//         articleContainer.append(emptyAlert);
//     }

//     function handleArticleSave() {
//         // The function is triggered when user wants to save an article
//         // When we rendered the article initially, we attached a js object containing headline id
//         // to the element using the .data method
//         var articleToSave = $(this).parents(".panel").data();
//         articleToSave.saved = true;
//         // Using a patch method to be semantic since this is an updateto an existing record in our collection
//         $.ajax({
//             method: "PATCH",
//             url: "/api/headlines",
//             data: articleToSave
//         })
//         .then(function(data) {
//             // If successful, mongoose will send back an object containing a key of "ok" with values of 1
//             // which casts to "true"
//             if (data.ok) {
//                 // Run initPage function again. This will reload entire list of articles
//                 initPage();
//             }
//         });
//     }

//     function handleArticleToScrape() {
//         // This function handles user clicking any "scrape new article" buttons
//         $.get("/api/fetch")
//         .then(function(data) {
//             // If able to scrape GFHerald and compare the articles to those
//             // already in our collection, re render articles on page
//             // and let user know how many unique articles were saved
//             initPage();
//             bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>");
//         });
//     }
// });