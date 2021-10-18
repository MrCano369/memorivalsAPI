import Layout from "../components/Layout";
import Room from "../components/Room";
import { withProtect } from "../lib/protect";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { getDecks } from "../lib/decks";
import CreateRoomModal from "../components/CreateRoomModal";
import useModal from "../hooks/useModal";
import setTitle from "../hooks/setTitle";

export default function minigamesPage({ decks }) {
  setTitle("Minijuegos");
  const newRoomModal = useModal();
  const [roomsList, setRoomsList] = useState([]);

  useEffect(() => {
    const socket = io("/minigames");
    socket.on("rooms", (rooms) => setRoomsList(rooms));
    return () => socket.disconnect();
  }, []);

  return (
    <Layout>
      <header>
        <p className="title">Memorama</p>
        <button className="button is-primary" onClick={newRoomModal.open}>
          Crear sala
        </button>
      </header>
      <hr />
      <p className="title is-4">Salas</p>
      <div className="roomsContainer">
        {roomsList.map((room) => (
          <Room key={room.id} room={room} />
        ))}
      </div>

      <CreateRoomModal
        state={newRoomModal.state}
        close={newRoomModal.close}
        decks={decks}
      />
    </Layout>
  );
}

export const getServerSideProps = withProtect(getDecks);
