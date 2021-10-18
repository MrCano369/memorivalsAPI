import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import AddCardForm from "../../components/AddCardForm";
import Card from "../../components/Card";
import CarruselModal from "../../components/CarruselModal";
import DeleteDeckModal from "../../components/DeleteDeckModal";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import useModal from "../../hooks/useModal";
import { getDeck } from "../../lib/decks";
import { withProtect } from "../../lib/protect";

export default function practicePage({ err, deck }) {
  const { id, name, cards, owner } = deck;
  const [started, setStarted] = useState(false);
  const [gameCards, setgameCards] = useState(cards);
  const [flipped, setFlipped] = useState(false);
  // const [currentCard, setCurrentCard] = useState(null);

  const flip = () => {
    setFlipped(true);
  };
  const ok = () => {
    const changedCards = [...gameCards];
    const card = changedCards.shift();
    setgameCards(changedCards);
    setFlipped(false);
  };

  const noOk = () => {
    const changedCards = [...gameCards];
    const card = changedCards.shift();
    changedCards.push(card);
    setgameCards(changedCards);
    setFlipped(false);
  };

  const start = () => setStarted(true);
  return (
    <>
      {err ? (
        <p className="title">No se encontró ningun fichero</p>
      ) : (
        <div className="section has-text-centered">
          <p className="title">Práctica de {name}</p>
          {!started && (
            <>
              <p className="subtitle">
                Observa la ficha, intenta recordar su significado y cuando estes
                listo, haz click sobre ella para girarla y ver la respuesta.
              </p>
              <button className="button is-primary" onClick={start}>
                Comenzar
              </button>
            </>
          )}
          {started && (
            <div className="practiceContainer">
              <Card card={gameCards[0]} func={flip} />
              <p className="subtitle">Quedan {gameCards.length} fichas</p>
              {flipped && (
                <div className="buttons">
                  <button className="button is-danger" onClick={noOk}>
                    No me la supe
                  </button>
                  <button className="button is-info" onClick={ok}>
                    Si me la supe
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export const getServerSideProps = withProtect(getDeck);
