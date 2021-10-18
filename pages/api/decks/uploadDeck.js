import { withProtectApi } from "../../../lib/protect";
const mongoose = require("mongoose");
// const jason = require("../../../jap.json");

const Users = require("../../../models/user");
const Decks = require("../../../models/deck");
// const Cards = require("../../../models/card");

async function uploadDeck(req, res) {
  const { name, jason } = req.body;
  if (!name || name.trim() == "") return res.json({ err: 1 }); // falta el name

  const { id: userId } = req.user;

  const user = await Users.findById(userId).populate("decks");
  if (user.decks.map((deck) => deck.name).includes(name))
    return res.json({ err: 2 }); // ya tienes un deck con ese name

  // const promises = [];
  var i = Date.now();
  const cards = jason.map(({ front, back }) => ({
    id: (i++).toString(36),
    front,
    back,
    level: 0,
  }));

  const newDeck = new Decks({ name, owner: userId, cards });
  user.decks.push(newDeck.id);

  await user.save();
  await newDeck.save();
  // promises.push(user.save());

  // await Users.findByIdAndUpdate(userId, { $push: { decks: newDeckId } });

  // jason.forEach((card) => {
  //   const newCard = new Cards({ deck: newDeck.id, ...card });
  //   newDeck.cards.push(newCard.id);
  //   promises.push(newCard.save());
  // });
  // promises.push(newDeck.save());
  // await Promise.all(promises);
  // const cards = jason.map((card) => ({ deck: newDeckId, ...card }));

  // await Cards.insertMany(cards);

  res.json({ ok: true });
}

export default withProtectApi(uploadDeck);

/*
async function uploadDeck(req, res) {
  const { name, jason } = req.body;
  if (!name || name.trim() == "") return res.json({ err: 1 }); // falta el name

  const { id: userId } = req.user;

  const { decks } = await Users.findById(userId).populate("decks");
  if (decks.map((deck) => deck.name).includes(name))
    return res.json({ err: 2 }); // ya tienes un deck con ese name


  const { id: newDeckId } = await new Decks({ name, owner: userId }).save();
  await Users.findByIdAndUpdate(userId, { $push: { decks: newDeckId } });

  const cards = jason.map((card) => ({ deck: newDeckId, ...card }));
  
  await Cards.insertMany(cards);

  res.json({ ok: true });
}
*/
