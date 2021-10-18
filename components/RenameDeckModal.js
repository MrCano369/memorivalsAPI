import { useEffect, useRef } from "react";
import { post } from "../lib/fetch";
import Modal from "./Modal";

export default function RenameDeckModal({
  deckId,
  deckName,
  state,
  close,
  func,
}) {
  const newNameInput = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newName = newNameInput.current.value;
    const res = await post("/api/decks/renameDeck", { deckId, newName });

    if (res.err) return console.log(res.err);
    func(newName);
    close();
  };

  useEffect(() => (newNameInput.current.value = deckName), [state]);

  return (
    <Modal state={state} close={close} title="Renombrar fichero">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <p className="label">Nuevo nombre</p>
          <div className="control">
            <input className="input" type="text" ref={newNameInput} required />
          </div>
        </div>
        <div className="buttons is-justify-content-flex-end">
          <button className="button is-light" type="button" onClick={close}>
            Cancelar
          </button>
          <button className="button is-primary">Renombrar</button>
        </div>
      </form>
    </Modal>
  );
}
