import { useRouter } from "next/dist/client/router";
import { useEffect, useRef } from "react";
import Modal from "./Modal";

export default function CreateRoomModal({ state, close, decks }) {
  const router = useRouter();
  const nameInput = useRef();
  const deckInput = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = nameInput.current.value;
    const deckId = deckInput.current.value;
    const res = await fetch("/createRoom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, deckId }),
    }).then((r) => r.json());
    if (res.err) return console.log(res.err);
    close();
    // router.push("/room?id=" + res.id);
    // console.log(res);
  };

  useEffect(() => (nameInput.current.value = ""), [state]);

  return (
    <Modal state={state} close={close} title="Crear partida">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <p className="label">Selecciona un fichero (de al menos 10 fichas)</p>
          <div className="control">
            <select className="input" ref={deckInput}>
              {decks.map(({ id, name, cardsAmount }) => (
                <option key={id} value={id} disabled={cardsAmount < 10}>
                  {`${name} (${cardsAmount} fichas)`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <p className="label">Nombre de la sala</p>
          <div className="control">
            <input className="input" type="text" ref={nameInput} required />
          </div>
        </div>

        <div className="buttons is-justify-content-flex-end">
          <button className="button is-light" onClick={close}>
            Cancelar
          </button>
          <button className="button is-primary">Crear</button>
        </div>
      </form>
    </Modal>
  );
}

/*
<select className="input" ref={deckInput}>
              {decks
                .filter(({ cardsAmount }) => cardsAmount >= 10)
                .map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
            </select>
*/
