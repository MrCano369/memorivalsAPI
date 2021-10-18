import { useRouter } from "next/dist/client/router";
import Modal from "./Modal";

export default function DeleteDeckModal({ deckId, state, close, func }) {
  const router = useRouter();

  const deleteDeck = async () => {
    const res = await fetch(`/api/decks/${deckId}/deleteDeck`).then((r) =>
      r.json()
    );
    if (res.err) return console.log(res.err);
    // close();
    router.push("/decks");
  };

  return (
    <Modal state={state} close={close} title="Eliminar este fichero">
      <p className="subtitle">
        Este fichero se eliminará de forma permanentemente y no podrá ser
        recuperado. ¿Estás seguro que deseas eliminarlo?
      </p>
      <div className="buttons is-justify-content-flex-end">
        <button className="button is-light" onClick={close}>
          Cancelar
        </button>
        <button className="button is-danger" onClick={deleteDeck}>
          Eliminar permanentemente
        </button>
      </div>
    </Modal>
  );
}
