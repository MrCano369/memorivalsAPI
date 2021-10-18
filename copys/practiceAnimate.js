import { useState } from "react";
import { getDeck } from "../../lib/decks";
import { withProtect } from "../../lib/protect";

export default function practicePage({ deck }) {
  const { name, cards } = deck;
  const [started, setStarted] = useState(false);
  const [gameCards, setgameCards] = useState(cards);
  const { front, back, level } = gameCards[0];
  const [buttons, setButtons] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const ok = async () => {
    setButtons(false);
    const changedCards = [...gameCards];
    changedCards[0].level++;
    setgameCards(changedCards);
    await animateCSS("pulse");
    await animateCSS("backOutRight");
    setFlipped(false);
    const changedCards2 = [...gameCards];
    const card = changedCards2.shift();
    setgameCards(changedCards2);
    animateCSS("bounceInDown");
  };

  const noOk = async () => {
    setButtons(false);
    const changedCards = [...gameCards];
    changedCards[0].level = 0;
    setgameCards(changedCards);
    await animateCSS("headShake");
    await animateCSS("backOutLeft");
    setFlipped(false);
    const changedCards2 = [...gameCards];
    const card = changedCards2.shift();
    changedCards2.push(card);
    setgameCards(changedCards2);
    animateCSS("bounceInDown");
  };

  const animateCSS = (animation) =>
    new Promise((resolve, reject) => {
      const animationName = "animate__" + animation;
      const node = document.querySelector("#card");
      node.classList.add("animate__animated", animationName);

      function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove("animate__animated", animationName);
        resolve("Animation ended");
      }

      node.addEventListener("animationend", handleAnimationEnd, {
        once: true,
      });
    });

  const reveal = () => {
    setFlipped(!flipped);
    setButtons(true);
  };

  const start = async () => {
    setStarted(true);
    await new Promise((ok) => ok());
    animateCSS("bounceInDown");
  };

  return (
    <div className="section has-text-centered">
      <p className="title">Práctica de {name}</p>
      {!started && (
        <>
          <p className="subtitle">
            Observa la ficha, intenta recordar su significado y cuando estes
            listo, haz click sobre ella para girarla y ver la respuesta.
          </p>
          <button className="button is-primary" onClick={start}>
            Comenzar
          </button>
        </>
      )}
      {started && (
        <div className="practiceContainer">
          <div id="card">
            <img id="img" src={`/images/levels/${level}.png`} />
            <div
              className={"flashCard" + (flipped ? " flipped" : "")}
              onClick={reveal}
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
          </div>

          <p className="subtitle">Quedan {gameCards.length} fichas</p>
          {buttons && (
            <div className="buttons">
              <button className="button is-danger" onClick={noOk}>
                No me la supe
              </button>
              <button className="button is-info" onClick={ok}>
                Si me la supe
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = withProtect(getDeck);
