import { useEffect, useRef, useState } from "react";

export default function Clock({ state, name }) {
  const [timer, setTimer] = useState(null);
  const clock = useRef();

  var p = 0;

  const start = () => {
    // if (name == "MrCano369") console.log("iniciado");
    setTimer(
      setInterval(() => {
        clock.current.style.background = `conic-gradient(transparent ${++p}%, #21618C 0)`;
      }, 100)
    );
  };

  const stop = () => {
    p = 0;
    clock.current.style.background = "#21618C";
    clearInterval(timer);
  };

  const clear = () => {
    clearInterval(timer);
  };

  useEffect(() => {
    state ? start() : stop();
  }, [state]);

  useEffect(() => {
    return () => clear();
  }, []);
  return <div className="clock" ref={clock}></div>;
}
