import { withProtectApi } from "../../../../lib/protect";

const Users = require("../../../../models/user");
const Decks = require("../../../../models/deck");
// const Cards = require("../../../../models/card");

async function deleteDeck(req, res) {
  const { id: deckId } = req.query;
  const { id: userId } = req.user;

  await Decks.findByIdAndDelete(deckId);
  await Users.findByIdAndUpdate(userId, { $pull: { decks: deckId } });
  res.json({ ok: true });
}

export default withProtectApi(deleteDeck);
