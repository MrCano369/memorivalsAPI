module.exports = {
  password: "p4pGwjq42Yayv68fHe0WeAH9HzE6v6Z3",
  cookieName: "memorivals_session",
  cookieOptions: {
    maxAge: 86400, //1d in seconds
    secure: process.env.NODE_ENV === "production",
  },
};
