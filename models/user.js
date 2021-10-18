const mongoose = require("mongoose");
mongoose.pluralize(null);

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  pass: String,
  decks: [{ type: Schema.ObjectId, ref: "Decks" }],
  profileImg: { type: String, default: "defaultAvatar.png" },
  victories: { type: Number, default: 0 },
});

global.User = global.User || mongoose.model("Users", userSchema);
module.exports = global.User;
