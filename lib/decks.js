const { isValidObjectId } = require("mongoose");
const Users = require("../models/user");
const Decks = require("../models/deck");

function rand(max = 1, min = 0) {
  return parseInt(Math.random() * (max - min + 1)) + min;
}

Array.prototype.extract = function (i) {
  return this.splice(i, 1)[0];
};

Array.prototype.extractR = function () {
  return this.extract(rand(this.length - 1));
};

async function getDecks({ req }) {
  const { id } = req.user;
  const { decks } = await Users.findById(id, "decks").populate("decks");
  const changedDecks = decks.map(({ id, name, color, cards }) => ({
    id,
    name,
    color,
    cardsAmount: cards.length,
  }));
  return { props: { decks: changedDecks } };
}

async function getMyDeck({ query, req }) {
  const { id: userId } = req.user;
  const { id: deckId } = query;

  if (!isValidObjectId(deckId))
    return { redirect: { destination: "/deckNotFound" } }; //deckId invalida

  const { decks } = await Users.findById(userId).populate("decks", "_id");
  if (!decks.map(({ id }) => id).includes(deckId))
    return { redirect: { destination: "/deckNotFound" } }; //no es tu deck

  const deck = await Decks.findById(deckId);
  if (!deck) return { redirect: { destination: "/deckNotFound" } }; //deck no encontrado

  const { name: deckName, color, cards } = deck;

  return { props: { deck: { deckId, deckName, color, cards } } };
}

async function getSharedDeck({ query, req }) {
  const { id: deckId } = query;
  if (!isValidObjectId(deckId))
    return { redirect: { destination: "/deckNotFound" } }; //id invalida

  const deck = await Decks.findById(deckId)
    .populate("owner", "name profileImg")
    .lean();
  if (!deck) return { redirect: { destination: "/deckNotFound" } }; //deck no encontrado

  const { name: deckName, cards } = deck;
  const { _id, ...owner } = deck.owner;
  return { props: { deck: { deckId, deckName, owner, cards } } };
}

async function getPracticeDeck({ query, req }) {
  //falta comprobar si es tu deck o no
  const { id } = query;
  if (!isValidObjectId(id))
    return { redirect: { destination: "/deckNotFound" } }; //id invalida

  const deck = await Decks.findById(id).lean();
  if (!deck) return { redirect: { destination: "/deckNotFound" } }; //deck no encontrado

  const { name, cards } = deck;
  if (cards.length < 10) return { redirect: { destination: `/decks/${id}` } };

  // const gameCards = [];
  // for (let i = 0; i < 10; i++) gameCards.push(cards.extractR());

  const gameCards = [];
  //const maxs = ["", 20, 50, 80, 140]; original maxs

  //pilaN**3*5
  const maxs = ["", 20, 45, 80, 125, 180];

  const pilas = [];
  for (let i = 0; i < maxs.length; i++) {
    pilas[i] = [];
    pilas[i].max = maxs[i];
  }
  cards.forEach((card) => pilas[card.level].push(card));

  const setCard = (pila) => gameCards.push(pila.extractR());

  const trySetLuckyCard = (pila) => {
    //if (!pila.length) return;
    if (Math.random() < (1 / pila.max ** 2) * pila.length ** 2) setCard(pila);
  };

  const setDefaultCard = () => {
    for (let pilaN = 0; pilaN < pilas.length; pilaN++) {
      if (pilas[pilaN].length) return setCard(pilas[pilaN]);
    }
  };

  for (let i = 0; i < 10; i++) {
    let pilaN = 5;
    while (!gameCards[i]) {
      if (pilaN) trySetLuckyCard(pilas[pilaN]);
      else setDefaultCard();
      pilaN--;
    }
  }

  return { props: { deck: { id, name, cards: gameCards } } };
}

export { getDecks, getMyDeck, getSharedDeck, getPracticeDeck };

//   const resp = await fetch("../pages/api/decks/12345").then((r) => r.json());
