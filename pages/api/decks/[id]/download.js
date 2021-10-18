import { withProtectApi } from "../../../../lib/protect";
const fs = require("fs");

const Decks = require("../../../../models/deck");

async function download(req, res) {
  const { id: deckId } = req.query;
  const { name, cards } = await Decks.findById(deckId);
  const filePath = `./downloadDecks/${deckId}.json`;
  const fileName = `${name}.json`;
  await fs.promises.writeFile(filePath, JSON.stringify(cards, null, 2));
  //revisar que sea mi deck
  //validar front y back
  //validar id
  //   res.send({});
  const downloadStream = fs.createReadStream(filePath);
  await new Promise((resolve) => {
    downloadStream.pipe(res);
    downloadStream.on("end", resolve);
  });

  //   const imageBuffer = fs.readFileSync(filePath)
  //   res.send(imageBuffer)
  //   res.download(filePath, fileName);
  //   res.json({ newCard });
}

export default withProtectApi(download);

// const { decks } = await Users.findById(id, "decks -_id").populate("decks", "name -_id");
