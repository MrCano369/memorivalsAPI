import { withProtect } from "../lib/protect";
import io from "socket.io-client";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import WaitingPlayer from "../components/WaitingPlayer";
import MemoCard from "../components/MemoCard";
import Player from "../components/Player";
import memorama from "../hooks/memorama";
import setTitle from "../hooks/setTitle";

export default function roomPage() {
  setTitle("Sala");

  const router = useRouter();
  const toBack = () => router.push("/minigames");

  const [state, actions] = memorama();
  const { roomName, started, players, cards, isMyTurn, me, rival, result } =
    state;
  const {
    roomInfo,
    getReady,
    flipCardRequest,
    setPlayers,
    startGame,
    flipCard,
    abandon,
    endGame,
    par,
    nopar,
    setSocket,
  } = actions;

  useEffect(() => {
    const newSocket = io("/memo");
    newSocket.on("players", (players) => setPlayers(players));
    newSocket.on("start", (cards, inTurn) => startGame(cards, inTurn));
    newSocket.on("flipped", (i) => flipCard(i));
    newSocket.on("abandonado", () => abandon());
    newSocket.on("par", () => par());
    newSocket.on("nopar", () => nopar());
    newSocket.on("end", (result) => endGame(result));
    newSocket.on("roomInfo", (roomName) => roomInfo(roomName));
    newSocket.on("connect_error", () => router.push("/minigames"));
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return (
    <div className="container layout">
      <header>
        <button className="button is-warning" onClick={toBack}>
          Abandonar
        </button>
      </header>

      <p className="title has-text-centered">{roomName}</p>
      {started ? (
        <div className="game">
          <Player turn={isMyTurn} player={me} />
          <div className="board">
            {cards.map((card) => (
              <MemoCard key={card.id} card={card} func={flipCardRequest} />
            ))}
          </div>
          <Player turn={!isMyTurn} player={rival} />
        </div>
      ) : (
        <>
          <div className="notification is-info playersContainer">
            {players.map((player) => (
              <WaitingPlayer key={player.id} player={player} />
            ))}
            {!rival && (
              <div className="box">
                <p className="subtitle">Esperando rival...</p>
              </div>
            )}
          </div>
          <div className="buttons is-justify-content-center">
            {!rival ? (
              <button className="button is-link">Invitar</button>
            ) : (
              !me.ready && (
                <button className="button is-primary" onClick={getReady}>
                  Estoy listo!
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export const getServerSideProps = withProtect();
