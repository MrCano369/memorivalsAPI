const mongoose = require("mongoose");
// const uri = process.env.MONGODB_URI;
const URI =
  "mongodb+srv://MrCano369:acr3945@mrcano369-sbz3s.mongodb.net/MemoRivals?retryWrites=true&w=majority";

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

require("../models/user");
require("../models/deck");

const connection = mongoose
  .connect(URI, options)
  .then((db) => console.log("DB conectada"));

global.connection = global.connection || connection;
