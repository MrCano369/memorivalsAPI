import { useReducer } from "react";
import { getPracticeDeck } from "../../lib/decks";
import { withProtect } from "../../lib/protect";
import animateCSS from "../../lib/animateCSS";
import setTitle from "../../hooks/setTitle";
import { useRouter } from "next/dist/client/router";
import { post } from "../../lib/fetch";

const types = {
  start: "start",
  reveal: "reveal",
  setLevel: "setLevel",
  nextCard: "nextCard",
};

const initialState = {
  started: false,
  gameCards: [],
  flipped: false,
  buttons: false,
};

const gameReducer = (state, action) => {
  const { gameCards, flipped } = state;
  const { type, payload } = action;

  switch (type) {
    case types.start:
      return { ...state, started: true };

    case types.reveal:
      return { ...state, flipped: !flipped, buttons: true };

    case types.setLevel:
      payload ? gameCards[0].level++ : (gameCards[0].level = 0);
      return { ...state, gameCards, buttons: false };

    case types.nextCard:
      if (payload) {
        if (gameCards.length == 1) return { ...state, started: false };
        gameCards.shift();
      } else gameCards.push(gameCards.shift());
      return { ...state, gameCards, flipped: false };

    default:
      return state;
  }
};

export default function practicePage({ deck }) {
  const { id: deckId, name, cards } = deck;
  setTitle(name + " (práctica)");
  const [game, dispatch] = useReducer(gameReducer, {
    ...initialState,
    gameCards: cards,
    // gameCards: [cards[0]],
  });
  const { started, gameCards, flipped, buttons } = game;
  const { id: cardId, front, back, level } = gameCards[0];

  const router = useRouter();
  const toBack = () => router.push("/minigames");

  const ok = async () => {
    post("/api/practice/setLevel", { deckId, cardId, set: true });
    const card = document.querySelector("#card");
    const level = document.querySelector("#level");
    dispatch({ type: types.setLevel, payload: true });
    await animateCSS(level, "pulse");
    await animateCSS(card, "backOutRight");
    dispatch({ type: types.nextCard, payload: true });
    animateCSS(card, "bounceInDown");
  };

  const noOk = async () => {
    post("/api/practice/setLevel", { deckId, cardId, set: false });
    const card = document.querySelector("#card");
    const level = document.querySelector("#level");
    dispatch({ type: types.setLevel, payload: false });
    await animateCSS(level, "headShake");
    await animateCSS(card, "backOutLeft");
    dispatch({ type: types.nextCard, payload: false });
    animateCSS(card, "bounceInDown");
  };

  const reveal = () => dispatch({ type: types.reveal });

  const start = async () => {
    dispatch({ type: types.start });
    await new Promise((ok) => ok()); // <--
    const card = document.querySelector("#card");
    animateCSS(card, "bounceInDown");
  };

  return (
    <div className="container layout">
      <header>
        <button className="button is-warning" onClick={toBack}>
          Volver
        </button>
      </header>

      <div className="has-text-centered">
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
              <img id="level" src={`/images/levels/${level}.png`} />
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
    </div>
  );
}

export const getServerSideProps = withProtect(getPracticeDeck);
// const {level} = state.currentCard;
// state.currentCard.level = payload? level+1: 0;
