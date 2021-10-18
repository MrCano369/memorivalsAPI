import { useRef } from "react";
import { post } from "../lib/fetch";
import Modal from "./Modal";

export default function ImportDeckModal({ state, close, func }) {
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

    const jason = await readFile();
    const res = await post("/api/decks/importDeck", { jason });
    if (res.err) return console.log(res.err);
    func(res.newDeck);
    close();
  };

  return (
    <Modal state={state} close={close} title="Nuevo fichero">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <p className="label">Importar fichero (archivo .json)</p>
          <div className="control">
            <input className="input" type="file" ref={fileInput} required />
          </div>
        </div>
        <div className="buttons is-justify-content-flex-end">
          <button className="button is-light" onClick={close} type="button">
            Cancelar
          </button>
          <button className="button is-primary">Importar</button>
        </div>
      </form>
    </Modal>
  );
}

/*
Array.from(gdt.getElementsByTagName("a")).map((a, i) => {
  var w = window.open(a.href, "w" + i);
  var img = w.document.querySelector("#img").src;
  w.close();
  return img;
});

Array.from(gdt.getElementsByTagName("a"))
  .map((a, i) => {
    var w = window.open(a.href, "w" + i);
    return w;
  })
  .map((w) => {
    var img = w.document.querySelector("#img").src;
    w.close();
    return img;
  });

var arr = Array.from(gdt.getElementsByTagName("a")).map((a) => a.href);
function open(i = 0) {
  if (arr[i]) {
    var a = arr[i];
    var w = window.open(a, "w" + i);
    console.log(w);
    // var img = w.document.querySelector("#img").src;
    // w.close();
    // setTimeout(()=>open(i+1),100)
  } else return;
}
open();

////////el ''bueno''
var arr = Array.from(gdt.getElementsByTagName("a")).map((a, i) => {
  var w = window.open(a.href, "w" + i);
  return w;
});
var urls = arr.map((w) => {
  var img = w.document.querySelector("#img").src;
  w.close();
  return img;
});

//copiar el array 'urls'
//ir a https://zjicdjr.kvhazbamqpxf.hath.network  y pegarlo
import("https://cdn.jsdelivr.net/npm/client-zip/index.js").then(
  (m) => (downloadZip = m.downloadZip)
);

async function downloadTestZip() {
  const imgs = [];
  urls.forEach((url) => imgs.push(fetch(url)));
  await Promise.all(imgs);

  const blob = await downloadZip(imgs).blob();

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "test.zip";
  link.click();
  link.remove();
}
downloadTestZip();
//rip cada url tiene un pto dominio diferente

var imgCanvas = document.createElement("canvas");
imgContext = imgCanvas.getContext("2d");

imgCanvas.width = img.width;
imgCanvas.height = img.height;

imgContext.drawImage(img, 0, 0, img.width, img.height);
document.body.append(imgCanvas);
imgCanvas.toBlob((b) => console.log(b));
// imgInfom = imgCanvas.toDataURL("image/png");

var image = document.createElement("img");
image.crossOrigin = "Anonymous";
image.src =
  "https://bfqrnif.dfujapsrrazz.hath.network/h/477341fd0cadd631237e7869e3b8bd3693c5fa4a-198679-1280-1785-jpg/keystamp=1633585200-96ce7f5412;fileindex=94981302;xres=1280/_girls_drawing_Pgina_017_Imagen_0001.jpg";
document.body.append(image);
*/
