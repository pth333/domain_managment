module.exports = (app) => {
  const domains = require("../controllers/domain.controller.js");
  const authenticateJWT = require("../middleware/authenticateJWT");

  var router = require("express").Router();

  router.get("/list", authenticateJWT, domains.findAll);

  router.post("/create", domains.create);

  router.patch("/update/:id", domains.update);

  router.patch("/update/:id/status", domains.status);

  router.delete("/delete/:id", domains.delete);

  app.use("/api/domain", router);
};
