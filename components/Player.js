import { useEffect, useState } from "react";

export default function Player({ turn, player }) {
  const { name, img, points } = player;
  const [p, setP] = useState(0); //porcentaje

  useEffect(() => {
    const timer = setInterval(() => setP((p) => p && p + 1), 100);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => (turn ? setP(1) : setP(0)), [turn]);
  useEffect(() => points && setP(1), [points]);

  return (
    <div className="has-text-centered player">
      <div
        className="clock"
        style={{ background: `conic-gradient(transparent ${p}%, #3e8ed0 0)` }}
      />
      <img src={"images/Avatars/" + img} />
      <p className="subtitle">{name}</p>
      <img src={`images/nums/${points}.png`} />
    </div>
  );
}

// void element.offsetWidth
