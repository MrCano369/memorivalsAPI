import { withProtectApi } from "../../../lib/protect";

const Users = require("../../../models/user");
const Decks = require("../../../models/deck");

async function importDeck(req, res) {
  const { jason } = req.body;
  const { name, color } = jason;

  const { id: userId } = req.user;
  const user = await Users.findById(userId);
  // const user = await Users.findById(userId).populate("decks");
  // if (user.decks.map((deck) => deck.name).includes(name))
  //   return res.json({ err: 1, message: "deck name already used" });

  var i = Date.now();
  const cards = jason.cards.map((card) => ({
    ...card,
    id: (i++).toString(36),
    level: 0,
  }));

  const newDeck = new Decks({ name, color, owner: userId, cards });
  user.decks.push(newDeck.id);

  await Promise.all([user.save(), newDeck.save()]);

  res.json({
    ok: true,
    message: "imported",
    newDeck: { id: newDeck.id, name, color, cardsAmount: cards.length },
  });
}

export default withProtectApi(importDeck);
