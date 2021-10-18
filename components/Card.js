import { useState } from "react";

export default function Card({ card, func }) {
  const [fliped, setFliped] = useState(false);
  const { front, back } = card;

  return (
    <div
      className={"flashCard" + (fliped ? " flipped" : "")}
      onClick={() => setFliped(!fliped)}
    >
      <div className="box">
        <p className="subtitle is-3">{front}</p>
      </div>
      <div className="box">
        <p
          className="subtitle is-3"
          dangerouslySetInnerHTML={{ __html: back }}
        />
      </div>
    </div>
  );
}
