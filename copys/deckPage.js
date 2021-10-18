import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import AddCardForm from "../../components/AddCardForm";
import CarruselModal from "../../components/CarruselModal";
import DeleteDeckModal from "../../components/DeleteDeckModal";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import useModal from "../../hooks/useModal";
import { getDeck } from "../../lib/decks";
import { withProtect } from "../../lib/protect";

export default function deckPage({ deck }) {
  const { id, name, cards, owner } = deck;
  useEffect(() => (document.title = name), []);
  const router = useRouter();

  const [cardsList, setCardsList] = useState(cards);
  const [deleteDeckModalState, openDeleteDeckModal, closeDeleteDeckModal] =
    useModal();
  const [carruselModalState, openCarruselModal, closeCarruselModal] =
    useModal();

  const goToPractice = () => router.push("/practice/" + id);
  const addCardList = (newCard) => setCardsList([...cardsList, newCard]);

  return (
    <Layout>
      <p className="title">{name}</p>
      <p className="">Propietario: {owner.name}</p>
      <p className="">Fichas: {cardsList.length}</p>

      <div className="is-flex is-flex-direction-column is-align-items-center">
        <AddCardForm deckId={id} func={addCardList} />

        {/* <div className="cardsContainer">
            {cardsList.map((card) => (
              <Card key={card.id} card={card} />
              ))}
            </div> */}
        <Table cards={cardsList} func={openCarruselModal} />

        <div className="buttons">
          <button className="button is-info" onClick={goToPractice}>
            Practicar
          </button>
          <button className="button is-danger" onClick={openDeleteDeckModal}>
            Eliminar este fichero
          </button>
        </div>
      </div>
      <CarruselModal
        cards={cards}
        state={carruselModalState}
        close={closeCarruselModal}
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
