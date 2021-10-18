import Tr from "./Tr";

export default function Table({ cards, func }) {
  return (
    // <div className="container box tableContainer">
    //<table className="table is-fullwidth">
    <div className="box content">
      <table>
        <thead>
          <tr>
            <th>Pregunta</th>
            <th>Respuesta</th>
          </tr>
        </thead>
      </table>
      <div className="tbody">
        <table>
          <tbody>
            {cards.map((card) => (
              <Tr key={card.id} card={card} func={func} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
