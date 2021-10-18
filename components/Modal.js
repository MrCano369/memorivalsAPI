export default function Modal({ title, state, close, children }) {
  return (
    <div className={"modal" + (state ? " is-active" : "")}>
      <div className="modal-background" onClick={close}></div>
      <div className="modal-card" style={{ maxWidth: "550px" }}>
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button className="delete" onClick={close}></button>
        </header>
        <section className="modal-card-body">{children}</section>
      </div>
    </div>
  );
}
