import { withProtectApi } from "../../../lib/protect";

const Users = require("../../../models/user");
const Decks = require("../../../models/deck");

async function renameDeck(req, res) {
  const { deckId, newName } = req.body;
  if (!newName || newName.trim() == "")
    return res.json({ err: 1, message: "the name is missing" });

  // const { id: userId } = req.user;
  // const { decks } = await Users.findById(userId).populate("decks");
  // if (decks.map((deck) => deck.name).includes(newName))
  //   return res.json({ err: 2, message: "deck name already used" });

  await Decks.findByIdAndUpdate(deckId, { name: newName });
  res.json({ ok: true, newName });
}

export default withProtectApi(renameDeck);
