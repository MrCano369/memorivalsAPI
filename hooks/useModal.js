import { useState } from "react";

export default function useModal() {
  const [state, setState] = useState(false);
  const open = () => setState(true);
  const close = () => setState(false);
  return { state, open, close };
}
