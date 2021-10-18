export default function Row({ i, card }) {
  const { front, back } = card;
  return (
    <div>
      <span>{i + 1}</span>
      <span>{front}</span>
      <span>{back}</span>
    </div>
  );
}
