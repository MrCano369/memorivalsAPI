import { useEffect } from "react";

export default function setTitle(title) {
  useEffect(() => (document.title = title), []);
}
