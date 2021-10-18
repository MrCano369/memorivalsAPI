import { useRef } from "react";

export default function AddCardForm({ func }) {
  const frontInput = useRef();
  const backInput = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const front = frontInput.current.value;
    const back = backInput.current.value;
    const id = Date.now().toString(36);
    func({ id, front, back, level: 0 });
    frontInput.current.value = "";
    backInput.current.value = "";
    frontInput.current.focus();
  };

  return (
    <form className="addCardForm" onSubmit={handleSubmit}>
      <div className="field">
        <p className="label">Pregunta</p>
        <div className="control">
          <input className="input" type="text" ref={frontInput} required />
        </div>
      </div>
      <div className="field">
        <p className="label">Respuesta</p>
        <div className="control">
          <input className="input" type="text" ref={backInput} required />
        </div>
      </div>
      <button className="button is-primary">Agregar</button>
    </form>
  );
}

// const res = await fetch(`/api/decks/${deckId}/addCard`, {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ front, back }),
// }).then((r) => r.json());
// if (res.err) return console.log(res.err);
// func(res.newCard);
