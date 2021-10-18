export default function x() {}

export async function getServerSideProps() {
  return { redirect: { destination: "/login" } };
}
