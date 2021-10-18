const app = require("express")();
const mongoose = require("mongoose");
mongoose.pluralize(null);
const URI =
  "mongodb+srv://MrCano369:acr3945@mrcano369-sbz3s.mongodb.net/MemoRivals?retryWrites=true&w=majority";
const fs = require("fs");

const { connect, model, Schema } = mongoose;

connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => console.log("DB connected"));

const myDeck = model(
  "Decks",
  new Schema({
    name: String,
    owner: { type: Schema.ObjectId, ref: "Users" },
    cards: [{ type: Schema.ObjectId, ref: "Cards" }],
  })
);

model(
  "Cards",
  new Schema({
    front: String,
    back: String,
  })
);

startServer();
exportData();

async function exportData() {
  const { cards } = await myDeck
    .findById("614d2744d78840880c438ac6")
    .populate("cards", "front back -_id");
  console.log(cards);
  //   .select({ front: 1, back: 1, _id: 0 });
  await fs.promises.writeFile("./ingles.json", JSON.stringify(cards, null, 2));
}

async function startServer() {
  await app.listen(3000);
  console.log("Server started");
}
