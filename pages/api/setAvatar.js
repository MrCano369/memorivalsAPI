import { withProtectApi } from "../../lib/protect";
const Users = require("../../models/user");

async function setAvatar(req, res) {
  const { avatar } = req.body;
  await Users.findByIdAndUpdate(req.user.id, { profileImg: avatar });
  req.session.set("user", { ...req.user, profileImg: avatar });
  await req.session.save();
  res.json({ ok: true });
}

export default withProtectApi(setAvatar);
