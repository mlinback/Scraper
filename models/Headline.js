var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var headlineSchema = new Schema({
  // `title` is required and of type String
  headline: {
    type: String,
    required: true,
    unique: true
  },
  // `link` is required and of type String
  summary: {
    type: String,
    required: true,
  },
  // date
  date: String,
  saved: {
    type: Boolean,
    default: false
  }
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the headline with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Headline = mongoose.model("Headline", headlineSchema);

// Export the headline model
module.exports = Headline;
