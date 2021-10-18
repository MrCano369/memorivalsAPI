import { withIronSession } from "next-iron-session";
const cookieConfig = require("../../cookieConfig");

function logout(req, res) {
  req.session.destroy();
  res.redirect("/login");
}

export default withIronSession(logout, cookieConfig);
