export default function Card({ card, func }) {
  const { id, text, flipped, hide } = card;

  return (
    <div
      className={
        "cardMemo" + (flipped ? " flipped" : "") + (hide ? " hide" : "")
      }
    >
      <div
        className="box subtitle"
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <div className="box" onClick={() => func(id)}></div>
    </div>
  );
}
