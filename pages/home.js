import Layout from "../components/Layout";
import { withProtect } from "../lib/protect";
import Deck from "../components/Deck";
import setTitle from "../hooks/setTitle";

export default function home({ name }) {
  setTitle("Inicio");
  return (
    <Layout>
      <div className="has-text-centered">
        <p className="title">Inicio</p>
        <p className="subtitle">Bienvenido {name}</p>
        {/* <div className="buttons">
          <Link href="/profile">
            <button className="button is-info">Mi perfil</button>
          </Link>

          <Link href="/decks">
            <button className="button is-warning">Mis ficheros</button>
          </Link>

          <Link href="/minigames">
            <button className="button is-primary">Jugar</button>
          </Link>
        </div> */}
      </div>
      <hr />
      <p className="subtitle">Novedades</p>

      <hr />
      <p className="subtitle">Ficheros destacados</p>
      <Deck
        deck={{
          id: "616b4a0aa851cdf2fc1bf975",
          name: "Frases en Inglés",
          color: "purple",
          shared: true,
          cardsAmount: 845,
        }}
      />
    </Layout>
  );
}

export const getServerSideProps = withProtect();
