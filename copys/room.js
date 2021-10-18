import { withProtect } from "../lib/protect";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import WaitingPlayer from "../components/WaitingPlayer";
import Card from "../components/Card";
import Player from "../components/Player";

export default function roomPage() {
  const router = useRouter();

  const [playersList, setPlayersList] = useState([]);
  const [start, setStart] = useState(false);
  const [deck, setDeck] = useState([]);
  const [socket, setSocket] = useState(null);
  const [flippedCards, setFlippedCards] = useState([]);
  const [myClock, setMyClock] = useState(false);
  const [rivalClock, setRivalClock] = useState(false);
  const [playersList2, setPlayersList2] = useState({});
  // const socket = useSocket();

  const getReady = () => socket.emit("ready");
  const flipCard = (i) => socket.emit("flip", i);

  const myTurn = () => {
    setRivalClock(false);
    setMyClock(true);
  };

  const rivalTurn = () => {
    setRivalClock(true);
    setMyClock(false);
  };

  const init = () => {
    const socket = io("/memo");
    setSocket(socket);
    socket.on("players", (players) => {
      setPlayersList(players);
      const [p1, p2] = players;
      setPlayersList2({
        mine: p1.id == socket.id ? p1 : p2,
        rival: p1.id == socket.id ? p2 : p1,
      });
    });
    socket.on("start", (deck, inTurn) => {
      setStart(true);
      setDeck(deck);
      inTurn == socket.id ? myTurn() : rivalTurn();
    });
    socket.on("flipped", (i) => {
      const change = flippedCards;
      change[i] = true;
      setFlippedCards(change);
    });
    socket.on("abandonado", () => setStart(false));
    return function cleanup() {
      socket.disconnect();
    };
  };

  useEffect(init, []);

  // socket.on("connect_error", () => router.push("/minigames"));

  return (
    <div className="container">
      <p className="title has-text-centered">Room</p>
      {start ? (
        <div className="game">
          <Player clockState={myClock} player={playersList2.mine} />
          <div className="board">
            {deck.map((card, i) => (
              <Card
                key={i}
                state={flippedCards[i]}
                card={{ ...card, i }}
                func={flipCard}
              />
            ))}
          </div>
          <Player clockState={rivalClock} player={playersList2.rival} />
        </div>
      ) : (
        <div>
          <div className="notification is-info playersContainer">
            {playersList.map((player) => (
              <WaitingPlayer key={player.id} player={player} />
            ))}
            {playersList.length == 1 && (
              <div className="box">
                <p className="subtitle">Esperando rival...</p>
              </div>
            )}
          </div>
          <div className="buttons is-justify-content-center">
            {playersList.length == 1 ? (
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
//<button className="button is-primary" onClick={getReady}>
