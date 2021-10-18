import { withProtectApi } from "../../../lib/protect";
const { isValidObjectId } = require("mongoose");
const Users = require("../../../models/user");
const Decks = require("../../../models/deck");

async function stealDeck(req, res) {
  const { deckId } = req.body;
  const { id: userId } = req.user;

  console.log(deckId);
  if (!isValidObjectId(deckId))
    return res.json({ err: 1, message: "invalid deckId" });

  const deck = await Decks.findById(deckId);
  if (!deck) return res.json({ err: 2, message: "nonExistent deck" });

  const { name, cards } = deck;
  const { id: newDeckId } = await new Decks({
    name,
    cards,
    owner: userId,
  }).save();
  await Users.findByIdAndUpdate(userId, { $push: { decks: newDeckId } });

  //   const { id: userId } = req.user;
  //   const { decks } = await Users.findById(userId).populate("decks");
  //   if (decks.map((deck) => deck.name).includes(newName))
  //     return res.json({ err: 2, message: "repeated deck name" });
  res.json({ ok: true, message: "stealed", deckId: newDeckId });
}

export default withProtectApi(stealDeck);
