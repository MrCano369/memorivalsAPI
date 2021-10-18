import { withProtectApi } from "../../../../lib/protect";
const mongoose = require("mongoose");

const Users = require("../../../../models/user");
const Decks = require("../../../../models/deck");

async function addCard(req, res) {
  const { id: deckId } = req.query;
  const { front, back } = req.body;
  //revisar que sea mi deck
  //validar front y back
  //validar id
  const id = new mongoose.Types.ObjectId().toHexString();
  const newCard = { id, front, back, level: 0 };
  await Decks.findByIdAndUpdate(deckId, { $push: { cards: newCard } });
  res.json({ newCard });
}

export default withProtectApi(addCard);

// const { decks } = await Users.findById(id, "decks -_id").populate("decks", "name -_id");
