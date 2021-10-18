import { withIronSession } from "next-iron-session";
const cookieConfig = require("../cookieConfig");

function withProtect(handle) {
  return withIronSession((ctx) => {
    ctx.req.user = ctx.req.session.get("user");
    if (!ctx.req.user) return { redirect: { destination: "/login" } };
    if (handle) return handle(ctx);
    return { props: ctx.req.user };
  }, cookieConfig);
}

function withProtectApi(handle) {
  return withIronSession((req, res) => {
    req.user = req.session.get("user");
    if (!req.user) return res.redirect("/login");
    return handle(req, res);
  }, cookieConfig);
}

export { withProtect, withProtectApi };

// export default { withProtect, withProtectApi };
/*
next: espero una func pa yo llamarla asi func(req, res);

func withIronSession(func, cookieconfig){

  return 
}


*/
