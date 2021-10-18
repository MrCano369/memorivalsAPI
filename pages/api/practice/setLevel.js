import { withProtectApi } from "../../../lib/protect";
const Decks = require("../../../models/deck");

async function setLevel(req, res) {
  const { deckId, cardId, set } = req.body;
  const deck = await Decks.findById(deckId);
  const index = deck.cards.findIndex((c) => c.id == cardId);
  if (index == -1) return res.json({ err: "No se encontró la ficha" });

  const card = deck.cards[index];

  if (set) card.level++;
  else card.level = 0;

  deck.markModified("cards");
  await deck.save();

  res.json({ ok: true, message: `level is now ${card.level}` });
}

export default withProtectApi(setLevel);

// card.level = set ? card.level + 1 : 0;
