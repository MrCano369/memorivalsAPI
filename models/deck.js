const mongoose = require("mongoose");
mongoose.pluralize(null);

const Schema = mongoose.Schema;

const deckSchema = new Schema({
  name: String,
  color: { type: String, default: "blue" },
  owner: { type: Schema.ObjectId, ref: "Users" },
  cards: Array,
});

global.Deck = global.Deck || mongoose.model("Decks", deckSchema);
module.exports = global.Deck;

/*

 id: {
      type: Schema.ObjectId,
      unique: true,
      index: true,
      default: new mongoose.Types.ObjectId(),
    },

*/
