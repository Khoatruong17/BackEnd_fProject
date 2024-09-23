const express = require("express");
const HelloController = require("../controllers/indexController");
const RoleController = require("../controllers/roleController");

const initApiRouter = (app) => {
  const routerAPI = express.Router();

  routerAPI.get("/", HelloController.Hello);

  routerAPI.post("/createRole", RoleController.createRole);

  // Use the API router
  app.use("/", routerAPI);
};

module.exports = initApiRouter;
