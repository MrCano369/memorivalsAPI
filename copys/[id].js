import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import AddCardForm from "../../components/AddCardForm";
import Card from "../../components/Card";
import DeleteDeckModal from "../../components/DeleteDeckModal";
import Layout from "../../components/Layout";
import useModal from "../../hooks/useModal";
import { getDeck } from "../../lib/decks";
import { withProtect } from "../../lib/protect";

export default function deckPage({ err, id, name, cards, owner }) {
  const router = useRouter();

  const [cardsList, setCardsList] = useState(cards);
  const [deleteDeckModalState, openDeleteDeckModal, closeDeleteDeckModal] =
    useModal();

  const addCardList = (newCard) => setCardsList([...cardsList, newCard]);

  return (
    <Layout>
      {err ? (
        <p className="title">No se encontró ningun fichero</p>
      ) : (
        <>
          <p className="title">{name}</p>
          <p className="">Propietario: {owner.name}</p>
          <p className="">Fichas: {cardsList.length}</p>

          <AddCardForm deckId={id} func={addCardList} />

          <div className="cardsContainer">
            {cardsList.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </div>

          <div className="buttons">
            <button className="button is-info">Practicar</button>
            <button className="button is-danger" onClick={openDeleteDeckModal}>
              Eliminar este fichero
            </button>
          </div>

          <DeleteDeckModal
            deckId={id}
            state={deleteDeckModalState}
            close={closeDeleteDeckModal}
          />
        </>
      )}
    </Layout>
  );
}

export const getServerSideProps = withProtect(getDeck);
