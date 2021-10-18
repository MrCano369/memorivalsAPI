import Deck from "../../components/Deck";
import Layout from "../../components/Layout";
import { getDecks } from "../../lib/decks";
import { withProtect } from "../../lib/protect";
import useModal from "../../hooks/useModal";
import NewDeckModal from "../../components/NewDeckModal";
import { useState } from "react";
import setTitle from "../../hooks/setTitle";
import ImportDeckModal from "../../components/ImportDeckModal";

export default function decksPage({ decks }) {
  setTitle("Mis ficheros");
  const newDeckModal = useModal();
  const importModal = useModal();

  const [decksList, setDecksList] = useState(decks);

  const addNewDeck = (newDeck) => setDecksList([...decksList, newDeck]);

  return (
    <Layout>
      <header>
        <p className="title">Mis ficheros</p>
        <div className="buttons">
          <button className="button is-primary" onClick={newDeckModal.open}>
            Nuevo
          </button>
          <button className="button is-warning" onClick={importModal.open}>
            Importar
          </button>
        </div>
      </header>
      <hr />

      <div className="decksContainer">
        {decksList.map((deck) => (
          <Deck key={deck.id} deck={deck} />
        ))}
      </div>

      <NewDeckModal
        state={newDeckModal.state}
        close={newDeckModal.close}
        func={addNewDeck}
      />

      <ImportDeckModal
        state={importModal.state}
        close={importModal.close}
        func={addNewDeck}
      />
    </Layout>
  );
}

export const getServerSideProps = withProtect(getDecks);
