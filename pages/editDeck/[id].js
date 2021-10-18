import { useState } from "react";
import AddCardForm from "../../components/AddCardForm";
import Layout from "../../components/Layout";
import Tr from "../../components/Tr";
import { getMyDeck } from "../../lib/decks";
import { withProtect } from "../../lib/protect";
import { post } from "../../lib/fetch";
import setTitle from "../../hooks/setTitle";

export default function deckPage({ deck }) {
  const { deckId, deckName } = deck;
  setTitle(deckName + " (edición)");
  const [cards, setCards] = useState(deck.cards);
  const [isLoading, setIsLoading] = useState(false);

  const editCard = (id, prop, value) => {
    const changed = [...cards];
    const i = changed.findIndex((card) => card.id == id);
    changed[i][prop] = value;
    setCards(changed);
  };

  const addCard = (newCard) => {
    const changed = [...cards, newCard];
    setCards(changed);
  };

  const removeCard = (cardId) => {
    const changed = cards.filter((card) => card.id != cardId);
    setCards(changed);
  };

  const save = async () => {
    setIsLoading(true);
    const res = await post(`/api/decks/${deckId}/save`, { cards });
    setIsLoading(false);
    console.log(res);
  };

  return (
    <Layout>
      <header>
        <p className="title">{deckName} (edición)</p>
        <button
          className={`button is-primary ${isLoading ? "is-loading" : ""}`}
          onClick={save}
        >
          Guardar cambios
        </button>
      </header>
      <hr />
      <div className="box p-0 m-3">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Pregunta</th>
              <th>Respuesta</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card, i) => (
              <Tr
                key={i}
                i={i}
                card={card}
                func={editCard}
                func2={removeCard}
              />
            ))}
          </tbody>
        </table>
      </div>

      <AddCardForm func={addCard} />
    </Layout>
  );
}

export const getServerSideProps = withProtect(getMyDeck);
