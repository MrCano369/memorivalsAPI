const Users = require("../models/user");

async function getVictories({ req }) {
  const { id } = req.user;
  const { victories } = await Users.findById(id);
  return { props: { user: { ...req.user, victories } } };
}

export { getVictories };
