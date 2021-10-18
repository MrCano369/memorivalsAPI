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
  const { roomName, phase, players, cards, isMyTurn, me, rival, result } =
    state;

  const {
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
    rePlay,
    setSocket,
  } = actions;

  useEffect(() => {
    const socket = io("/memo");
    socket.on("players", (players) => setPlayers(players));
    socket.on("start", (cards, inTurn) => startGame(cards, inTurn));
    socket.on("flipped", (i) => flipped(i));
    socket.on("abandoned", () => abandoned());
    socket.on("par", () => par());
    socket.on("nopar", () => nopar());
    socket.on("end", (result) => endGame(result));
    socket.on("roomInfo", (roomName) => roomInfo(roomName));
    socket.on("connect_error", () => toBack());
    setSocket(socket);
    return () => socket.close();
  }, []);

  return (
    <div className="container layout">
      <header>
        <button className="button is-warning" onClick={toBack}>
          Abandonar
        </button>
      </header>
      <p className="title has-text-centered">{roomName}</p>

      {phase == "waiting" && (
        <>
          <div className="notification is-info playersContainer">
            {players.map((player) => (
              <WaitingPlayer key={player.socketId} player={player} />
            ))}
            {!rival && (
              <div className="box">
                <p className="subtitle">Esperando rival...</p>
              </div>
            )}
          </div>
          <div className="buttons is-justify-content-center">
            {me.ready && rival.ready && (
              <p className="subtitle">Comenzando...</p>
            )}
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

      {phase == "inGame" && (
        <div className="game">
          <Player turn={isMyTurn} player={me} />
          <div className="board">
            {cards.map((card) => (
              <MemoCard key={card.id} card={card} func={flip} />
            ))}
          </div>
          <Player turn={!isMyTurn} player={rival} />
        </div>
      )}

      {phase == "finished" && (
        <div className="results box">
          <p className="title has-text-centered">{result}</p>
          <div className="buttons is-justify-content-center">
            <button className="button is-warning" onClick={toBack}>
              Salir
            </button>
            <button className="button is-primary" onClick={rePlay}>
              Volver a jugar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = withProtect();
