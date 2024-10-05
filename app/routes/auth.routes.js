module.exports = (app) => {
  const user = require("../controllers/user.controller.js");
  const authenticateJWT = require("../middleware/authenticateJWT");
  const router = require("express").Router();

  router.post("/login", user.login);

  router.get("/list", authenticateJWT, user.findAll);

  router.post("/create", user.create);

  router.patch("/update/:id", user.update);

  router.delete("/delete/:id", user.delete);
 

  app.use("/api/user", router);
};
