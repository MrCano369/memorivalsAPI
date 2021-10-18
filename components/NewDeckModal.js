import { useEffect, useRef } from "react";
import { post } from "../lib/fetch";
import Modal from "./Modal";

export default function NewDeckModal({ state, close, func }) {
  const nameInput = useRef();
  const colorInput = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = nameInput.current.value;
    const color = colorInput.current.value;
    const res = await post("/api/decks/createDeck", { name, color });
    if (res.err) return console.log(res.err);
    func(res.newDeck);
    close();
  };

  useEffect(() => (nameInput.current.value = ""), [state]);

  return (
    <Modal state={state} close={close} title="Nuevo fichero">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <p className="label">Nombre del fichero</p>
          <div className="control">
            <input className="input" type="text" ref={nameInput} required />
          </div>
        </div>
        <div className="field">
          <p className="label">Color</p>
          <select className="input" ref={colorInput}>
            <option value="blue">Azul</option>
            <option value="green">Verde</option>
            <option value="red">Rojo</option>
            <option value="purple">Morado</option>
          </select>
        </div>
        <div className="buttons is-justify-content-flex-end">
          <button className="button is-light" type="button" onClick={close}>
            Cancelar
          </button>
          <button className="button is-primary">Crear</button>
        </div>
      </form>
    </Modal>
  );
}
