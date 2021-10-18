import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [state, setState] = useState(false);

  return (
    <nav
      className="navbar is-info"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link href="/home">
          <a className="navbar-item">
            {/* <img
              src="https://bulma.io/images/bulma-logo-white.png"
              width="112"
              height="28"
              alt=""
            /> */}
            <img src="/images/logo1.png" />
          </a>
        </Link>

        <button
          className={"navbar-burger" + (state ? " is-active" : "")}
          onClick={() => setState(!state)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div className={"navbar-menu" + (state ? " is-active" : "")}>
        <div className="navbar-start">
          <Link href="/profile">
            <a className="navbar-item">Mi perfil</a>
          </Link>
          <Link href="/decks">
            <a className="navbar-item">Mis ficheros</a>
          </Link>
          <Link href="/minigames">
            <a className="navbar-item">Jugar</a>
          </Link>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <Link href="/api/logout">
                <a className="button is-danger">Salir</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    // <div>
    //   <ul>
    //     <li>
    //       <Link href="/home">
    //         <h3>Inicio</h3>
    //       </Link>
    //     </li>
    //   </ul>
    //   <ul>
    //     <li>
    //       <Link href="/decks">
    //         <h3>Mis ficheros</h3>
    //       </Link>
    //     </li>
    //   </ul>
    //   <ul>
    //     <li>
    //       <Link href="/api/logout">
    //         <h3>Salir</h3>
    //       </Link>
    //     </li>
    //   </ul>
    // </div>
  );
}
