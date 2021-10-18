import { withIronSession } from "next-iron-session";
const cookieConfig = require("../../cookieConfig");
const Users = require("../../models/user");
const bcrypt = require("bcrypt");

async function register(req, res) {
  const { name, email, pass } = req.body;
  if (await Users.findOne({ name })) return res.json({ err: 1 });
  if (await Users.findOne({ email })) return res.json({ err: 2 });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salt);
  req.body.pass = hash;

  const user = await new Users(req.body).save();
  req.session.set("user", { id: user._id });
  await req.session.save();
  res.json({ ok: true });
}

export default withIronSession(register, cookieConfig);
