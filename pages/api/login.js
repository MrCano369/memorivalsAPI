import { withIronSession } from "next-iron-session";
const cookieConfig = require("../../cookieConfig");
const Users = require("../../models/user");
const bcrypt = require("bcrypt");

async function login(req, res) {
  const { name, pass } = req.body;
  const user = await Users.findOne({ name });
  if (user == null) return res.json({ err: 1 });

  const match = await bcrypt.compare(pass, user.pass);
  if (!match) return res.json({ err: 2 });

  const { id, name: userName, profileImg } = user;
  req.session.set("user", { id, name: userName, profileImg });
  await req.session.save();
  res.json({ ok: true });
}

export default withIronSession(login, cookieConfig);
