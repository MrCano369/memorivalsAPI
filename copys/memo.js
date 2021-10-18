const ironStore = require("iron-store/dist").default;
const cookie = require("cookie");
const cookieConfig = require("../cookieConfig");
//Genera un aleatorio entre un max y un min incluidos
function rand(max = 1, min = 0) {
  return parseInt(Math.random() * (max - min + 1)) + min;
}

//Extrae un elemento
Array.prototype.extract = function (i) {
  return this.splice(i, 1)[0];
};

//Extrae un elemento al azar
Array.prototype.extractR = function () {
  return this.extract(rand(this.length - 1));
};

//Obtiene un elemento al azar
Array.prototype.getR = function () {
  return this[rand(this.length - 1)];
};

//Extrae el primer elemento para insertarlo al final
Array.prototype.rotate = function () {
  this.push(this.shift());
};

//Revuelve los elementos al azar
Array.prototype.shuffle = function () {
  let range = this.length;
  while (--range) this.push(this.extract(rand(range)));
  return this;
};

//Quita los elementos que devuelven true en la funcion que pases como param
Array.prototype.quit = function (func) {
  let i = 0;
  while (i < this.length) func(this[i]) ? this.extract(i) : i++;
  return this;
};

var roomNum = 1;

// const Users = require("../models/user");
const Decks = require("../models/deck");
// const Cards = require("../models/card");

async function getSession(mycookie, { ttl, cookieName, password }) {
  const store = await ironStore({
    sealed: cookie.parse(mycookie)[cookieName],
    password,
    ttl: ttl * 1000,
  });
  return store.get("user");
}

const defaultRooms = [
  {
    name: "Sala 1",
    userId: "613940c8daabe7eaa0283230",
    deckId: "613cf51e62c4be219c9f1ae2",
  },
  {
    name: "Sala 2",
    userId: "613940c8daabe7eaa0283230",
    deckId: "613cf51e62c4be219c9f1ae2",
  },
  {
    name: "Sala 3",
    userId: "613940c8daabe7eaa0283230",
    deckId: "613cf51e62c4be219c9f1ae2",
  },
];

class Room {
  constructor(name, userId, deckId) {
    this.name = name;
    this.userId = userId;
    this.deckId = deckId;
    this.id = "r" + roomNum++;
    this.numCards = 5;
    this.nsp;
    this.pares = 0;
    this.players = [];
    this.flipped = [];
    this.started = false;
    this.timer;

    Decks.findById(this.deckId)
      .populate("cards", "front back")
      .lean()
      .then(({ name, cards }) => {
        this.completeDeck = cards;
      });
  }

  get numPlayers() {
    return this.players.length;
  }

  getMatchDeck() {
    this.gameCards = [];
    const cards = Array.from(this.completeDeck);
    for (let i = 0; i < this.numCards; i++) {
      const { front, back } = cards.extractR();
      this.gameCards.push({ i, text: front }, { i, text: back });
    }
    this.gameCards.shuffle();
    return this.gameCards.map(({ text }) => text);
  }

  msg(msgName, ...arg) {
    this.nsp.to(this.id).emit(msgName, ...arg);
  }

  joinPlayer(socket) {
    if (!this.nsp) this.nsp = socket.nsp;

    const user = {
      id: socket.id,
      name: socket.user.name,
      img: socket.user.profileImg,
      ready: false,
      points: 0,
    };

    // console.log("nuevo Player", socket.id);
    this.players.push(user);
    this.msg("players", this.players);

    socket.on("flip", (i) => this.flipCard(socket.id, i));

    // socket.on("disconnect", () => this.leavePlayer(socket.id));
    socket.on("disconnect", () => rooms.leavePlayer(socket));
    // socket.emit("roomInfo", this.deckName);

    socket.on("ready", () => {
      user.ready = true;
      this.msg("players", this.players);
      if (this.players[0].ready && this.players[1]?.ready)
        setTimeout(() => this.startMatch(), 3000);
    });
  }

  leavePlayer(id) {
    this.players.quit((p) => p.id == id);

    if (this.started) {
      this.endTurn();
      this.msg("abandonado");
      this.flipped = [];
      this.stopMatch();
    } else this.msg("players", this.players);
  }

  startTurn() {
    this.timer = setTimeout(() => this.nopar(), 10000);
  }
  endTurn() {
    clearInterval(this.timer);
  }

  startMatch() {
    this.started = true;
    this.players.shuffle();
    this.msg("start", this.getMatchDeck(), this.players[0].id);
    this.startTurn();
  }

  stopMatch() {
    this.started = false;
    this.pares = 0;
    this.players.forEach((p) => {
      p.points = 0;
      p.ready = false;
    });
    this.msg("players", this.players);
  }

  flipCard(socketId, i) {
    if (socketId != this.players[0].id) return;
    if (this.flipped.length == 2) return;
    if (i == this.flipped[0]) return;

    this.msg("flipped", i);

    if (this.flipped.push(i) == 2) {
      this.endTurn();

      const card1 = this.gameCards[this.flipped[0]].i;
      const card2 = this.gameCards[this.flipped[1]].i;
      card1 == card2 ? this.par() : this.nopar();
    }
  }

  par() {
    this.players[0].points++;

    this.timer = setTimeout(() => {
      this.msg("par");
      this.flipped = [];
      if (++this.pares == this.numCards) return this.endMatch();
      this.startTurn();
    }, 1000);
  }

  nopar() {
    this.players.rotate();

    this.timer = setTimeout(() => {
      this.msg("nopar");
      this.flipped = [];
      this.startTurn();
    }, 1000);
  }

  endMatch() {
    this.msg("end", this.getResult());
    this.stopMatch();
  }

  getResult() {
    const p1 = this.players[0];
    const p2 = this.players[1];
    if (p1.points > p2.points) return p1.id;
    if (p2.points > p1.points) return p2.id;
    return null;
  }
}

class Rooms {
  constructor() {
    this.rooms = [];
    defaultRooms.forEach((room) => this.createRoom(...Object.values(room)));
  }

  createRoom(name, userId, deckId) {
    this.rooms.push(new Room(name, userId, deckId));
  }

  toJson() {
    return this.rooms.map(({ name, numPlayers, id }) => ({
      name,
      numPlayers,
      id,
    }));
  }

  joinPlayer(socket) {
    socket.room.joinPlayer(socket);
    this.nsp.to("minigames").emit("rooms", this.toJson());
  }

  leavePlayer(socket) {
    socket.room.leavePlayer(socket.id);
    this.nsp.to("minigames").emit("rooms", this.toJson());
  }

  searchRoom(id) {
    return Object.values(this.rooms).find((room) => room.id == id);
  }
}

const rooms = new Rooms();

async function canConnect(socket, next) {
  // console.log(socket.handshake.headers.referer);
  const id = new URL(socket.handshake.headers.referer).searchParams.get("id");
  const room = rooms.searchRoom(id);

  if (!room || room.numPlayers == 2) return next(new Error("gg"));
  socket.room = room;

  const user = await getSession(socket.handshake.headers.cookie, cookieConfig);
  socket.user = user;
  socket.join(id);
  next();
}

function connect(socket) {
  rooms.joinPlayer(socket);
}

module.exports = (io) => {
  const minigames = io.of("/minigames");
  rooms.nsp = minigames;

  minigames.on("connection", (socket) => {
    socket.join("minigames");
    socket.emit("rooms", rooms.toJson());
  });

  const game = io.of("/memo");
  game.use(canConnect);
  game.on("connection", connect);
};
