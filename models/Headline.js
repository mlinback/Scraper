var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var headlineSchema = new Schema({
  headline: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true,
  },
  date: String,
  saved: {
    type: Boolean,
    default: false
  }
//   // `note` is an object that stores a Note id
//   // The ref property links the ObjectId to the Note model
//   // This allows us to populate the headline with an associated Note
//   note: {
//     type: Schema.Types.ObjectId,
//     ref: "Note"
//   }
});

var Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;
