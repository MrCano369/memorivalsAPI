import { withProtectApi } from "../../../lib/protect";

const Users = require("../../../models/user");
const Decks = require("../../../models/deck");

async function createDeck(req, res) {
  const { name, color } = req.body;

  if (!name || name.trim() == "")
    return res.json({ err: 1, message: "the name is missing" });

  const { id: userId } = req.user;
  const user = await Users.findById(userId).populate("decks");
  if (user.decks.map((deck) => deck.name).includes(name))
    return res.json({ err: 2, message: "deck name already used" });

  const newDeck = new Decks({ name, color, owner: userId });
  user.decks.push(newDeck.id);

  await Promise.all([user.save(), newDeck.save()]);

  res.json({
    ok: true,
    message: "created",
    newDeck: { id: newDeck.id, name, color, cardsAmount: 0 },
  });
}

export default withProtectApi(createDeck);

// const { decks } = await Users.findById(id, "decks -_id").populate("decks", "name -_id");
