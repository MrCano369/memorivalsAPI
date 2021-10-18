import { useRouter } from "next/dist/client/router";
import { useRef } from "react";
import setTitle from "../hooks/setTitle";

export default function register() {
  setTitle("Registro");
  const router = useRouter();
  const nameInput = useRef();
  const emailInput = useRef();
  const passInput = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameInput.current.value;
    const email = emailInput.current.value;
    const pass = passInput.current.value;
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, pass }),
    }).then((r) => r.json());
    if (res.err) return console.log(res.err);
    router.push("/home");
  };

  return (
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <p>Nombre</p>
        <input type="text" ref={nameInput} required></input>
        <p>Correo</p>
        <input type="email" ref={emailInput} required></input>
        <p>Clave</p>
        <input type="password" ref={passInput} required></input>
        <button>Acceder</button>
      </form>
    </div>
  );
}
