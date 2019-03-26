// Require dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// Set up port
var PORT = process.env.PORT || 3000;

// Instantiate express app
var app = express();

// Set up router
var router = express.Router();

// Require routes file pass our router object
require("./config/routes")(router);

// Designate public folder as a static directory
app.use(express.static(__dirname + "/public"));

// Connect Handlebars to Express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Use bodyParser in app
app.use(bodyParser.urlencoded({
    extended: false
}));

// Have every request go through our router middleware
app.use(router);

// If deployed, use deployed database. Otherwise use local mongoHeadLines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect mongoose to database
mongoose.connect(db, function(error) {
    // Log any errors connecting with mongoose
    if (error) {
        console.log(error);
    }
    // Or log success
    else {
        console.log("mongoose connection is successful");
    }
});

// Listn on port
app.listen(PORT, function() {
    console.log("Listening on port:" + PORT);
});