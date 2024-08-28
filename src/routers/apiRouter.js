const express = require("express");
const HelloController = require("../controllers/indexController");

const initApiRouter = (app) => {
  const routerAPI = express.Router();

  // Define your routes here
  routerAPI.get("/", HelloController.Hello);

  // Use the API router
  app.use("/", routerAPI);
};

module.exports = initApiRouter;

