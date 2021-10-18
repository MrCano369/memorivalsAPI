import { useEffect, useRef, useState } from "react";

export default function Tr({ i, card, func, func2 }) {
  // const [cardState, setCardState] = useState(card);
  const { front, back, id } = card;

  const frontInput = useRef();
  const backInput = useRef();
  // if (i == 16) console.log(front, back);

  const edited = (e) => {
    if (e.target.value == card[e.target.name]) return;
    func(id, e.target.name, e.target.value);
  };
  const deleted = () => func2(id);

  const set = (e) => {
    const changed = { ...cardState };
    changed[e.target.name] = e.target.value;
    setCardState(changed);
  };

  useEffect(() => (frontInput.current.value = front), [front]);
  useEffect(() => (backInput.current.value = back), [back]);

  return (
    <tr className="tr">
      <th>{i + 1}</th>
      <td>
        <input
          className="input"
          ref={frontInput}
          name="front"
          onBlur={edited}
        />
      </td>
      <td>
        <input className="input" ref={backInput} name="back" onBlur={edited} />
      </td>
      <td>
        <button className="delete" onClick={deleted}></button>
      </td>
      {/* <td dangerouslySetInnerHTML={{ __html: back }} /> */}
      {/* <td>
        <div className="buttons">
          <button className="button is-info">Editar</button>
          <button className="button is-danger">Borrar</button>
        </div>
      </td> */}
    </tr>
  );
}
