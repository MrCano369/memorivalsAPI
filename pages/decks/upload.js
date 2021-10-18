import { useRouter } from "next/dist/client/router";
import { useRef } from "react";
import Layout from "../../components/Layout";
import { withProtect } from "../../lib/protect";

export default function decksPage() {
  const router = useRouter();
  const nameInput = useRef();
  const fileInput = useRef();

  const readFile = () => {
    const file = fileInput.current.files[0];
    const reader = new FileReader();

    return new Promise((ok, nel) => {
      reader.onload = () => ok(JSON.parse(reader.result));
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameInput.current.value;
    const jason = await readFile();
    // console.log(jason);
    const res = await fetch("/api/decks/uploadDeck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, jason }),
    }).then((r) => r.json());
    if (res.err) return console.log(res.err);
    router.push("/decks");
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <input type="name" ref={nameInput} required />
        <input type="file" ref={fileInput} required />
        <button>Enviar</button>
      </form>
    </Layout>
  );
}

export const getServerSideProps = withProtect();
