import { withProtectApi } from "../../lib/protect";
// console.log(rooms);
console.log(require.cache);
// const obj2 = require("../../lib/pinga.mjs");
// const Decks = require("../../models/deck");

async function createMatch(req, res) {
  // const memo = require("../../lib/memo");
  // console.log(obj2);
  const { name, deckId } = req.body;
  if (!name || name.trim() == "") return res.json({ err: 1 }); // falta el name

  //   const { id: userId } = req.user;
  // rooms.createRoom(name, deckId);
  // ESTO NO JALA, USH!
  // ya tienes un deck con ese name

  //   const { id: newDeckId } = await new Decks({ name, owner: userId }).save();
  //   await Users.findByIdAndUpdate(userId, { $push: { decks: newDeckId } });
  res.json({ ok: true });
}

export default withProtectApi(createMatch);

// const { decks } = await Users.findById(id, "decks -_id").populate("decks", "name -_id");
