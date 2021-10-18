import { useRouter } from "next/dist/client/router";
import { useRef } from "react";
import setTitle from "../hooks/setTitle";

export default function login() {
  setTitle("Inicio de sesión");
  const router = useRouter();
  const nameInput = useRef();
  const passInput = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameInput.current.value;
    const pass = passInput.current.value;
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pass }),
    }).then((r) => r.json());
    if (res.err) return console.log(res.err);
    router.push("/home");
  };

  return (
    <div className="section hero">
      <img src="images/logo2.png" />
      <div className="container">
        <p className="title">Inicio de sesión</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <p className="label">Nombre</p>
            <div className="control has-icons-left">
              <input
                className="input"
                type="text"
                ref={nameInput}
                required
                defaultValue="MrCano369"
              ></input>
              <span className="icon is-small is-left">
                <i className="fas fa-user" />
              </span>
            </div>
          </div>
          <div className="field">
            <p className="label">Clave</p>
            <div className="control has-icons-left">
              <input
                className="input"
                type="password"
                ref={passInput}
                required
              ></input>
              <span className="icon is-small is-left">
                <i className="fas fa-lock" />
              </span>
            </div>
          </div>
          <div className="has-text-centered">
            <button className="button is-primary">Acceder</button>
          </div>
        </form>
      </div>
    </div>
  );
}
