import { withProtect } from "../lib/protect";
import io from "socket.io-client";
import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/dist/client/router";
import WaitingPlayer from "../components/WaitingPlayer";
import Card from "../components/Card";
import Player from "../components/Player";

const types = {
  start: "start",
  endGame: "endGame",
  readyPlayer: "readyPlayer",
  setPlayers: "setPlayers",
  flipCard: "flipCard",
  par: "par",
  nopar: "nopar",
};

const initialState = {
  socket: null,
  started: false,
  flippedCards: [],
  players: [],
};

const gameReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.openSocket:
      return { ...state, socket: payload };

    case types.start:
      const { players, socket } = state;
      const [p1, p2] = players;
      const mine = p1.id == socket.id ? p1 : p2;
      const rival = p1.id == socket.id ? p1 : p2;
      mine.turn = mine.id == payload.inTurn;
      rival.turn = !mine.turn;
      const cards = payload.cards.map((text, i) => ({ id: i, text }));
      return { ...state, started: true, cards, mine, rival };

    case types.endGame:
      return { ...state, started: false };

    case types.setPlayers:
      return { ...state, players: payload };

    case types.flipCard:
      state.flippedCards.push(payload);
      state.cards[payload].flipped = true;
      return { ...state };

    case types.par:
      state.flippedCards.forEach((id) => (state.cards[id].hide = true));
      state.flippedCards = [];
      state.mine.turn ? state.mine.points++ : state.rival.points++;
      return { ...state };

    case types.nopar:
      state.flippedCards.forEach((id) => (state.cards[id].flipped = false));
      state.flippedCards = [];
      state.mine.turn = !state.mine.turn;
      state.rival.turn = !state.rival.turn;
      return { ...state };

    default:
      return state;
  }
};

export default function roomPage() {
  const [game, dispatch] = useReducer(gameReducer, initialState);
  const { socket, started, players, cards, mine, rival } = game;
  const router = useRouter();

  const getReady = () => socket.emit("ready");
  const flipCard = (id) => mine.turn && socket.emit("flip", id);

  useEffect(() => {
    const newSocket = io("/memo");

    newSocket.on("players", (players) =>
      dispatch({ type: types.setPlayers, payload: players })
    );

    newSocket.on("start", (cards, inTurn) =>
      dispatch({ type: types.start, payload: { cards, inTurn } })
    );

    newSocket.on("flipped", (i) =>
      dispatch({ type: types.flipCard, payload: i })
    );

    newSocket.on("abandonado", () => dispatch({ type: types.endGame }));

    newSocket.on("par", () => dispatch({ type: types.par }));

    newSocket.on("nopar", () => dispatch({ type: types.nopar }));

    newSocket.on("end", (result) =>
      dispatch({ type: types.end, payload: result })
    );

    newSocket.on("connect_error", () => router.push("/minigames"));

    dispatch({ type: types.openSocket, payload: newSocket });

    return () => newSocket.close();
  }, []);

  return (
    <div className="container">
      <p className="title has-text-centered">Room</p>
      {started ? (
        <div className="game">
          <Player turn={isMyTurn} player={mine} />
          <div className="board">
            {cards.map((card) => (
              <Card key={card.id} card={card} func={flipCard} />
            ))}
          </div>
          <Player turn={!isMyTurn} player={rival} />
        </div>
      ) : (
        <div>
          <div className="notification is-info playersContainer">
            {players.map((player) => (
              <WaitingPlayer key={player.id} player={player} />
            ))}
            {players.length == 1 && (
              <div className="box">
                <p className="subtitle">Esperando rival...</p>
              </div>
            )}
          </div>
          <div className="buttons is-justify-content-center">
            {players.length == 1 ? (
              <button className="button is-link">Invitar</button>
            ) : (
              <button className="button is-primary" onClick={getReady}>
                Estoy listo!
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = withProtect();


import { useEffect } from "react";
import Clock from "./Clock";

export default function Player({ turn, player }) {
  const { name, img, points } = player;

  useEffect(() => {
    if (name == "MrCano369") console.log(turn);
  }, [turn, points]);

  return (
    <div className="has-text-centered player">
      <Clock state={turn} name={name} />
      <img src={"images/Avatars/" + img} />
      <p className="subtitle">{name}</p>
      <img src={`images/nums/${points}.png`} />
    </div>
  );
}


import { useEffect, useRef, useState } from "react";

export default function Clock({ state, name }) {
  const [timer, setTimer] = useState(null);
  const clock = useRef();

  var p = 0;

  const start = () => {
    // if (name == "MrCano369") console.log("iniciado");
    setTimer(
      setInterval(() => {
        clock.current.style.background = `conic-gradient(transparent ${++p}%, #21618C 0)`;
      }, 100)
    );
  };

  const stop = () => {
    p = 0;
    clock.current.style.background = "#21618C";
    clearInterval(timer);
  };

  const clear = () => {
    clearInterval(timer);
  };

  useEffect(() => {
    state ? start() : stop();
  }, [state]);

  useEffect(() => {
    return () => clear();
  }, []);
  return <div className="clock" ref={clock}></div>;
}
