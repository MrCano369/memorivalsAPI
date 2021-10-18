export default function WaitingPlayer({ player }) {
  const { name, img, ready } = player;
  return (
    <div className="box waitingPlayer">
      <div>
        <img src={"images/Avatars/" + img} width="50px" />
        <p className="subtitle">{name}</p>
      </div>
      <img
        src={`images/${ready ? "ready.png" : "notready.png"}`}
        width="50px"
      />
    </div>
  );
}
