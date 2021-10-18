import { useRouter } from "next/dist/client/router";
import Carrusel from "../../components/Carrusel";
import Layout from "../../components/Layout";
import { getSharedDeck } from "../../lib/decks";
import { withProtect } from "../../lib/protect";
import setTitle from "../../hooks/setTitle";
import { post } from "../../lib/fetch";

export default function deckPage({ deck }) {
  const { deckId, deckName, owner, cards } = deck;
  setTitle(deckName);
  const emptyDeck = !cards.length;
  const router = useRouter();

  const stealDeck = async () => {
    const res = await post("/api/decks/stealDeck", { deckId });
    if (res.ok) router.push(`/decks/${res.deckId}`);
  };

  return (
    <Layout>
      <p className="title">{deckName}</p>
      <p className="subtitle">Propietario: {owner.name}</p>
      <div className="buttons">
        <button className="button is-primary" onClick={stealDeck}>
          Robar
        </button>
      </div>
      <hr />

      {emptyDeck ? (
        <p className="title has-text-centered">No hay fichas</p>
      ) : (
        <Carrusel cards={cards} />
      )}
    </Layout>
  );
}

export const getServerSideProps = withProtect(getSharedDeck);
