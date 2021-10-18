import { useReducer } from "react";

const types = {
  roomInfo: "roomInfo",
  setSocket: "setSocket",
  start: "start",
  endGame: "endGame",
  readyPlayer: "readyPlayer",
  setPlayers: "setPlayers",
  flipped: "flipped",
  par: "par",
  nopar: "nopar",
  rePlay: "rePlay",
};

const initialState = {
  socket: null,
  phase: "waiting",
  flippedCards: [],
  players: [],
  me: {},
};

const gameReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.roomInfo:
      return { ...state, roomName: payload };

    case types.setSocket:
      return { ...state, socket: payload };

    case types.start:
      return {
        ...state,
        phase: "inGame",
        cards: payload.cards.map((text, i) => ({ id: i, text })),
        isMyTurn: state.socket.id == payload.inTurn,
      };

    case types.endGame:
      var result = payload || "Empate";
      if (payload == state.me.socketId) result = "Has ganado!";
      if (payload == state.rival.socketId) result = "Gana tu rival";
      return { ...state, result, phase: "finished" };

    case types.setPlayers:
      const [p1, p2] = payload;
      return {
        ...state,
        players: payload,
        me: p1.socketId == state.socket.id ? p1 : p2,
        rival: p1.socketId == state.socket.id ? p2 : p1,
      };

    case types.flipped:
      state.flippedCards.push(payload);
      state.cards[payload].flipped = true;
      return { ...state };

    case types.par:
      state.flippedCards.forEach((id) => (state.cards[id].hide = true));
      state.flippedCards = [];
      state.isMyTurn ? state.me.points++ : state.rival.points++;
      return { ...state };

    case types.nopar:
      state.flippedCards.forEach((id) => (state.cards[id].flipped = false));
      state.flippedCards = [];
      state.isMyTurn = !state.isMyTurn;
      return { ...state };

    case types.rePlay:
      return { ...state, phase: "waiting" };

    default:
      return state;
  }
};

export default function memorama() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const { socket, isMyTurn } = gameState;

  const action = (type, payload) => dispatch({ type, payload });

  const getReady = () => socket.emit("ready");
  const flip = (id) => isMyTurn && socket.emit("flip", id);
  const roomInfo = (roomName) => action(types.roomInfo, roomName);
  const setPlayers = (players) => action(types.setPlayers, players);
  const startGame = (cards, inTurn) => action(types.start, { cards, inTurn });
  const flipped = (i) => action(types.flipped, i);
  const abandoned = () => action(types.endGame, "El rival ha abandonado");
  const endGame = (result) => action(types.endGame, result);
  const par = () => action(types.par);
  const nopar = () => action(types.nopar);
  const rePlay = () => action(types.rePlay);
  const setSocket = (socket) => action(types.setSocket, socket);

  const actions = {
    roomInfo,
    getReady,
    flip,
    setPlayers,
    startGame,
    flipped,
    abandoned,
    endGame,
    par,
    nopar,
    setSocket,
    rePlay,
  };

  return [gameState, actions];
}
