import { truncate } from "fs";

// /* global bootbox */
$(document).ready(function () {
    // Getting a reference to the article container div we will render all articles inside of
    var articleContainer = $(".article-container");
    // Add event listeners for dynamically generated buttons for deleting articles,
    // pulling up article notes, saving article notes, deleting article notes
    $(document).on("click", "btn.delete", handleArticleDelete);
    $(document).on("click", "btn.notes", handleArticleNotes);
    $(document).on("click", "btn.save", handleNoteSave);
    $(document).on("click", "btn.note-delete", handleNoteDelete);

    // Run initPage
    initPage();

    function initPage() {
        // Empty article container, run AJAX request for any saved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function (data) {
            // If we have headlines, rend to page
            if (data && data.length) {
                renderArticles(data);
            } else {
                // otherwise, render message
                renderEmpty();
            }
        });
    }

    funciton renderArticles(articles) {
        // This function handles appending HTML containing our article data to page
        // We are passed an array of JSON containing all available articles in our db
        var articlePanels = [];
        // We pass each article JSON object to the createPanel funiton which returns a bootstrap
        // panel with our article data inside
        for (var i = 0; i < articleContainer.length, i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        // Once we have all HTML for articles stored in our articlePanels array,
        // append them to articlPanels container
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        // This function takes in single JSON object for an article/headline
        // It constructs a jQuery element containing all formatted HTML
        // for article panel
        var panel =
            $(["<div class='panel [[panel-default'>",
                "div class='panel-heading'>",
                "<h3>",
                article.headline,
                "<a class='btn btn-danger delete'>",
                "Delete From Saved",
                "</a>",
                "<a class='btn btn-info notes'>Article Notes</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "</div>",
                "</div>",
            ].join(""));
        // Attach article's id to jQuery element
        // Use when trying to figure out which article the user wants to remove or open notes
        panel.data("_id", article._id);
        // Return constructed panel jQuery element
        return panel;
    }

    function renderEmpty() {
        // Renders some HTML to page explaining we don't have any articles to view
        // Using joined array of HTML string data because it is easier to read/change than concatenated string
        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>Oh no, it looks like there are no saved articles.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>Would you like to browse availabe articles?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a href='/'>Browse Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        // Appending data to page
        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data) {
        // The function handles redering note list items to our notes modal
        // Setting up an array of notes to render after finished
        // Setting up a currentNote variable to temporarily store each note
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            // If we don't have notes, display message explaining this
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article.",
                "</li>"
            ].join("");
            notesToRender.push9(currentNote);
        }
        else {
            // If we have notes, go through each one
            for (var i = 0; i < data.notes.length; i++) {
                // Constructs an li element to contain our noteText and delete button
                currentNote = $({
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                // Store note id on delete button for ease access when trying to delete
            currentNote.children("button").data("_id", data.notes[i]._id);
            // Adding currentNote to the notesToRender array
            notesToRender.push(currentNote);
            }
        }
        // Now append notesToRender to note-container inside note modal
        $(".note-container").append(notesToRender);
    }

    function handleArticleDelete() {
        // This function handles deleting articles/headlines
        // We grab the id of the article to delete from panel element the delete button sits inside
        var articleToDelete = $(this).parents(".panel").data();
        // Using a delete method here for semantics since we are deleting article/headline
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data) {
            // if this works, run initPage again, it will rerender list of saved articles
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleNotes() {
        // Function handles opening notes modal and displaying notes
        // Grab id of article to get notes from panel element the delete button sits inside
        var currentArticle = $(this).parents(".panel").data();
        // Grab anynotes with this article/headline id
        $.get("/api/notes/" + currentArticle._id).then(function(data) {
            // Constructing our initial HTML to ad to notes modal
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes For Article:",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            // Adding formatted HTML to notel modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            // Adding information about article and article notes to save button
            // When trying to add a new note
            $(".btn.save").data("article", noteData);
        });
    }

    function handleNoteSave() {
        // Function handles what happens when user triess to save new note for an article
        // Setting a variable to hold data about our note
        // Grabbing note typed into input box
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        // If we have typed data in note input field, format it
        // and post to "/api/notes" route and send formatted noteData
        if (newNote) {
            noteData = {
                id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function() {
                // When complete, close modal
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        // Function handles note deletion
        // First grab id of note to delete
        // Data stored on delete button
        var noteToDelete = $(this).data("_id");
        // Perform DELETE request to "/apin/notes" with id of note to delete as a parameter
        $.ajax({
            url: "/api/notes" + noteToDelete,
            method: "DELETE"
        }).then(funciton() {
            // Hide modal when done
            bootbox.hideAll();
        });
    }

});