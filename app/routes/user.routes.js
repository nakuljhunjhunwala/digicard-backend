module.exports = app => {
  const tutorials = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", tutorials.create);

  // Retrieve a single Tutorial with id
  router.get("/:id", tutorials.findOne);

  app.use("/digicard", router);
};
