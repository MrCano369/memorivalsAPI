import { useRouter } from "next/dist/client/router";
import Carrusel from "../../components/Carrusel";
import DeleteDeckModal from "../../components/DeleteDeckModal";
import Layout from "../../components/Layout";
import useModal from "../../hooks/useModal";
import { getDeck } from "../../lib/decks";
import { withProtect } from "../../lib/protect";
import setTitle from "../../hooks/setTitle";
import RenameDeckModal from "../../components/RenameDeckModal";
import { useState } from "react";

export default function deckPage({ deck }) {
  const { id, deckName, cards, owner, isMine } = deck;
  const { ownerName, profileImg } = owner;
  const [deckNameState, setDeckNameState] = useState(deckName);
  setTitle(deckName);

  const renameDeck = (newName) => {
    setDeckNameState(newName);
    document.title = newName;
  };

  const emptyDeck = !cards.length;
  const minCards = cards.map(({ front, back }) => ({ front, back }));
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(minCards));

  const router = useRouter();

  const toBack = () => router.push("/decks");

  const [deleteDeckModalState, openDeleteDeckModal, closeDeleteDeckModal] =
    useModal();
  const [renameDeckModalState, openRenameDeckModal, closeRenameDeckModal] =
    useModal();

  const goToEdit = () => router.push("/editDeck/" + id);
  const goToPractice = () => router.push("/practice/" + id);

  return (
    <Layout>
      <div className="">
        <p className="title">{deckNameState}</p>
        {!isMine && <p className="subtitle">Propietario: {ownerName}</p>}
        <div className="buttons">
          {/* <button className="button is-success" onClick={toBack}>
            Volver
          </button> */}
          {isMine ? (
            <>
              <button
                className="button is-primary"
                onClick={openRenameDeckModal}
              >
                Renombrar
              </button>

              <button className="button is-warning" onClick={goToEdit}>
                Editar
              </button>

              <button
                className="button is-info"
                onClick={goToPractice}
                disabled={cards.length < 10}
              >
                Practicar
              </button>

              {!emptyDeck && (
                <a
                  disabled={emptyDeck}
                  className="button is-link"
                  href={dataStr}
                  download={`${deckNameState}.json`}
                >
                  Exportar
                </a>
              )}

              <button
                className="button is-danger"
                onClick={openDeleteDeckModal}
              >
                Eliminar
              </button>
            </>
          ) : (
            <button className="button is-primary">
              Agregar a mis ficheros
            </button>
          )}
        </div>
        <hr />
      </div>

      {emptyDeck ? (
        <p className="title has-text-centered">No hay fichas</p>
      ) : (
        <Carrusel cards={cards} />
      )}

      <RenameDeckModal
        deckId={id}
        deckName={deckNameState}
        state={renameDeckModalState}
        close={closeRenameDeckModal}
        func={renameDeck}
      />

      <DeleteDeckModal
        deckId={id}
        state={deleteDeckModalState}
        close={closeDeleteDeckModal}
      />
    </Layout>
  );
}

export const getServerSideProps = withProtect(getDeck);
