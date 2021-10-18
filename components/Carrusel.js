import { useState } from "react";
import Animated from "./Animated";
import Card from "./Card";

export default function Carrusel({ cards }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [next, setNext] = useState(0);

  const left = () => {
    if (index == 0) return;
    setVisible(false);
    setNext(-1);
  };

  const right = () => {
    if (index == cards.length - 1) return;
    setVisible(false);
    setNext(1);
  };

  const gg = () => {
    setVisible(true);
    setIndex(index + next);
  };

  return (
    <div className="carrusel">
      <Animated
        enterAnim="rotateInDownLeft"
        leaveAnim="rotateOutDownLeft"
        leaved={gg}
        visible={visible}
      >
        <Card card={cards[index]} />
      </Animated>

      <span className="leftArrow" onClick={left}>
        <i className="fas fa-2x fa-angle-left" />
      </span>
      <span className="rightArrow" onClick={right}>
        <i className="fas fa-2x fa-angle-right" />
      </span>

      <div>
        {index + 1}/{cards.length}
      </div>
    </div>
  );
}
