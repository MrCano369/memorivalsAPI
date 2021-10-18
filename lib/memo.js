const ironStore = require("iron-store/dist").default;
const cookie = require("cookie");
const cookieConfig = require("../cookieConfig");
const { isValidObjectId } = require("mongoose");
require("./myFunctions");

const Users = require("../models/user");
const Decks = require("../models/deck");

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
    deckId: "616b4a0aa851cdf2fc1bf975",
  },
  {
    name: "Sala 2",
    deckId: "616b49b5a851cdf2fc1bf956",
  },
];

class Room {
  constructor(roomName, deckName, cards, owner, nsp, id) {
    this.roomName = roomName;
    this.deckName = deckName;
    this.completeDeck = cards;
    this.owner = owner;
    this.nsp = nsp;
    this.id = id;
    this.numCards = 10;
    this.pares = 0;
    this.players = [];
    this.flipped = [];
    this.started = false;
    this.timer;
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
    const user = {
      socketId: socket.id,
      userId: socket.user.id,
      name: socket.user.name,
      img: socket.user.profileImg,
      ready: false,
      points: 0,
    };

    this.players.push(user);
    this.msg("players", this.players);
    socket.on("flip", (i) => this.flipCard(socket.id, i));
    socket.emit("roomInfo", this.name);
    socket.on("ready", () => {
      if (user.ready) return;
      user.ready = true;
      this.msg("players", this.players);
      if (this.players[0].ready && this.players[1]?.ready)
        setTimeout(() => this.startMatch(), 3000);
    });
  }

  leavePlayer(id) {
    this.players.quit((p) => p.socketId == id);

    if (this.started) {
      this.endTurn();
      this.msg("abandoned");
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
    this.msg("start", this.getMatchDeck(), this.players[0].socketId);
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
    if (socketId != this.players[0].socketId) return;
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
    var winner;

    if (p1.points > p2.points) winner = p1;
    else if (p2.points > p1.points) winner = p2;

    winner &&
      Users.findByIdAndUpdate(winner.userId, { $inc: { victories: 1 } });
    return winner ? winner.socketId : false;
  }
}

class RoomsController {
  constructor() {
    this.rooms = [];
    this.roomNum = 0;
  }

  init(minigamesPage, gamePage) {
    this.minigamesPage = minigamesPage;
    this.gamePage = gamePage;

    minigamesPage.on("connection", (socket) => {
      socket.join("minigames");
      socket.emit("rooms", this.toJson());
    });

    gamePage.use(canConnect);
    gamePage.on("connection", connect);

    defaultRooms.forEach(({ name, deckId }) => this.createRoom(name, deckId));
  }

  async createRoom(roomName, deckId) {
    if (!isValidObjectId(deckId)) return "err1";
    const deck = await Decks.findById(deckId).populate("owner", "name").lean();
    if (!deck) return "err2";
    const { name: deckName, owner, cards } = deck;

    if (cards.length < 10) return "err3";
    const id = `r${++this.roomNum}`;
    this.rooms.push(
      new Room(roomName, deckName, cards, owner.name, this.gamePage, id)
    );
    this.minigamesPage.to("minigames").emit("rooms", this.toJson());
    // return id;
  }

  toJson() {
    return this.rooms.map(({ roomName, deckName, owner, numPlayers, id }) => ({
      roomName,
      deckName,
      owner,
      numPlayers,
      id,
    }));
  }

  joinPlayer(socket) {
    socket.room.joinPlayer(socket);
    socket.on("disconnect", () => this.leavePlayer(socket));
    this.minigamesPage.to("minigames").emit("rooms", this.toJson());
  }

  leavePlayer(socket) {
    socket.room.leavePlayer(socket.id);
    this.minigamesPage.to("minigames").emit("rooms", this.toJson());
  }

  searchRoom(id) {
    return Object.values(this.rooms).find((room) => room.id == id);
  }
}

const memo = new RoomsController();

async function canConnect(socket, next) {
  // console.log(socket.handshake.headers.referer);
  const id = new URL(socket.handshake.headers.referer).searchParams.get("id");
  const room = memo.searchRoom(id);
  if (!room || room.numPlayers == 2) return next(new Error("gg"));
  socket.room = room;
  const user = await getSession(socket.handshake.headers.cookie, cookieConfig);
  socket.user = user;
  socket.join(id);
  next();
}

function connect(socket) {
  memo.joinPlayer(socket);
}

async function createRoom(req, res) {
  const { name, deckId } = req.body;
  const id = await memo.createRoom(name, deckId);
  res.json({ id });
}

module.exports = (io, app) => {
  memo.init(io.of("/minigames"), io.of("/memo"));
  app.post("/createRoom", createRoom);
};

/*
class Room {
  constructor(name, deckId, nsp, id) {
    this.name = name;
    this.deckId = deckId;
    this.nsp = nsp;
    this.id = id;
    this.numCards = 5;
    this.pares = 0;
    this.players = [];
    this.flipped = [];
    this.started = false;
    this.timer;

    // console.log(nsp);
    Decks.findById(this.deckId)
      .populate("cards", "front back")
      .lean()
      .then(({ name, cards }) => {
        this.completeDeck = cards;
      });
  }
*/
