module.exports = (app) => {
  const dashboardDomain = require("../controllers/domain.controller.js");
  const authenticateJWT = require("../middleware/authenticateJWT");

  var router = require("express").Router();

  router.get("/", authenticateJWT, dashboardDomain.getDomainDashboard);

  app.use("/api/dashboard", router);
};
