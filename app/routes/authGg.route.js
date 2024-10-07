module.exports = (app) => {
  const passport = require("passport");
  const router = require("express").Router();
  const jwt = require("jsonwebtoken");

  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
    function (req, res) {
      res.send("Google Authentication Route");
    }
  );
  // Route callback sau khi Google trả về kết quả
  router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
      const user = req.user.toJSON();
      const token = jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: "2h",
      });
      res.redirect(`https://dm.adful.io/dashboard?token=${token}`);
    }
  );

  app.use("/auth", router);
};
