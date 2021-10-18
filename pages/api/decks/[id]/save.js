import { withProtectApi } from "../../../../lib/protect";

const Users = require("../../../../models/user");
const Decks = require("../../../../models/deck");

async function save(req, res) {
  const { id: deckId } = req.query;
  const { cards } = req.body;

  await Decks.findByIdAndUpdate(deckId, { cards });
  res.json({ ok: "saved" });
}

export default withProtectApi(save);
