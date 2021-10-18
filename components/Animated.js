import { useEffect, useRef } from "react";
import animateCSS from "../lib/animateCSS";

export default function Animated({
  enterAnim,
  leaveAnim,
  leaved,
  visible,
  children,
}) {
  const elem = useRef();

  const enter = async () => {
    await animateCSS(elem.current, enterAnim);
  };
  const leave = async () => {
    await animateCSS(elem.current, leaveAnim);
    leaved && leaved();
  };
  useEffect(() => (visible ? enter() : leave()), [visible]);
  return (
    <div ref={elem} className="animate__faster animated">
      {children}
    </div>
  );
}
