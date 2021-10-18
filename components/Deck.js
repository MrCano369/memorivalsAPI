import { useRouter } from "next/dist/client/router";
import Folder from "./Folder";

const palete = {
  purple: ["#C39BD3", "#AF7AC5", "#9B59B6", "#884EA0"],
  blue: ["#85C1E9", "#5DADE2", "#3498DB", "#2E86C1"],
  green: ["#76D7C4", "#48C9B0", "#1ABC9C", "#17A589"],
  red: ["#F1948A", "#EC7063", "#E74C3C", "#CB4335"],
};

// const colours = ["purple", "blue", "green", "red"];

export default function Deck({ deck }) {
  const { id, name, color, shared, cardsAmount } = deck;
  const router = useRouter();

  const goToDeckPage = () => {
    router.push(`/${shared ? "sharedDeck" : "decks"}/` + id);
  };

  return (
    <div className="deck">
      <div onClick={goToDeckPage}>
        <p className="title is-3">{name}</p>
        <p className="subtitle">fichas: {cardsAmount}</p>
      </div>
      {/* <img src="images/folder.svg" /> */}
      <Folder color={palete[color]} />
    </div>
  );
}

/*
<div>
      <div className="box deck" onClick={() => router.push("/decks/" + id)}>
        <p className="title is-4">{name}</p>
        <p className="subtitle">fichas: {cardsAmount}</p>
      </div>
      <img src="images/folder.svg" />
    </div>
*/
