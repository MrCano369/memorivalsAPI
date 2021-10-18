import { useRouter } from "next/dist/client/router";

export default function Room({ room }) {
  const { roomName, deckName, owner, numPlayers, id } = room;
  const router = useRouter();

  const enterToRoom = () => numPlayers < 2 && router.push(`/room?id=${id}`);

  return (
    <>
      <div className="room" onClick={enterToRoom}>
        <p className="title is-4">{roomName}</p>
        <p className="subtitle is-6">
          Fichero: {deckName}
          <br />
          Creador: {owner}
        </p>
        <p>
          <i className="fas fa-user" />
          {"  "}
          {numPlayers}/2
        </p>
        {/* <p>Memorama</p> */}
      </div>
    </>
  );
}

// <div className="box room" {...(numPlayers<2 && {onClick: enterToRoom})} >
