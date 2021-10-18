import { useRouter } from "next/dist/client/router";
import Carrusel from "../../components/Carrusel";
import DeleteDeckModal from "../../components/DeleteDeckModal";
import Layout from "../../components/Layout";
import useModal from "../../hooks/useModal";
import { getMyDeck } from "../../lib/decks";
import { withProtect } from "../../lib/protect";
import setTitle from "../../hooks/setTitle";
import RenameDeckModal from "../../components/RenameDeckModal";
import { useRef, useState } from "react";

export default function deckPage({ deck }) {
  const { deckId, deckName, color, cards } = deck;
  const [deckNameState, setDeckNameState] = useState(deckName);
  setTitle(deckName);

  const file = useRef();

  const renameDeck = (newName) => {
    setDeckNameState(newName);
    document.title = newName;
  };
  const emptyDeck = !cards.length;

  const router = useRouter();

  const toBack = () => router.push("/decks");

  const deleteDeckModal = useModal();
  const renameDeckModal = useModal();

  const download = () => {
    const minCards = cards.map(({ level, id, ...card }) => card);
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify({ name: deckName, color, cards: minCards })
      );
    file.current.href = dataStr;
    file.current.click();
  };
  const shareDeck = () => alert(`http://localhost:3000/sharedDeck/${deckId}`);
  const goToEdit = () => router.push("/editDeck/" + deckId);
  const goToPractice = () => router.push("/practice/" + deckId);

  return (
    <Layout>
      <header>
        <p className="title">{deckNameState}</p>
        <div className="buttons">
          <button className="button is-primary" onClick={renameDeckModal.open}>
            Renombrar
          </button>

          <button className="button is-warning" onClick={goToEdit}>
            Editar
          </button>

          <button className="button is-success" onClick={shareDeck}>
            Compartir
          </button>

          <button
            className="button is-info"
            onClick={goToPractice}
            disabled={cards.length < 10}
          >
            Practicar
          </button>

          <a ref={file} download={`${deckNameState}.json`}></a>

          <button
            disabled={emptyDeck}
            onClick={download}
            className="button is-link"
          >
            Exportar
          </button>

          <button className="button is-danger" onClick={deleteDeckModal.open}>
            Eliminar
          </button>
        </div>
      </header>

      <hr />

      {emptyDeck ? (
        <p className="title has-text-centered">No hay fichas</p>
      ) : (
        <Carrusel cards={cards} />
      )}

      <RenameDeckModal
        deckId={deckId}
        deckName={deckNameState}
        state={renameDeckModal.state}
        close={renameDeckModal.close}
        func={renameDeck}
      />

      <DeleteDeckModal
        deckId={deckId}
        state={deleteDeckModal.state}
        close={deleteDeckModal.close}
      />
    </Layout>
  );
}

export const getServerSideProps = withProtect(getMyDeck);
