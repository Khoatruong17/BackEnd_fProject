const express = require("express");
require("../config/passport");
const HelloController = require("../controllers/indexController");
const RoleController = require("../controllers/roleController");
const authController = require("../controllers/authController");
const propertiesController = require("../controllers/propertiesController");
const roomsController = require("../controllers/roomController");
const passport = require("passport");

const initApiRouter = (app) => {
  const routerAPI = express.Router();

  routerAPI.get("/", HelloController.Hello);

  //auth router
  routerAPI.post("/login", authController.Login);
  //routerAPI.post("/login", passport.authenticate('local',{successRedirect : 'protected'}) );
  routerAPI.get("/logout", authController.Logout);
  routerAPI.post("/register", authController.Register);
  routerAPI.get("/protected", authController.Protected);

  routerAPI.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  routerAPI.get("/auth/callback", authController.handleGoogleAuthCallback);
  // routerAPI.get(
  //   "/auth/callback",
  //   passport.authenticate("google", {
  //     failureRedirect: "/login",
  //     successRedirect: "/protected",
  //   })
  // );
  routerAPI.post("/createRole", RoleController.createRole);

  //properties api
  routerAPI.get("/getAllProperties", propertiesController.getAllProperties);
  routerAPI.post("/addProperties", propertiesController.createProperty);
  routerAPI.put("/updateProperties/:id", propertiesController.updateProperty);
  routerAPI.delete(
    "/deleteProperties/:id",
    propertiesController.deleteProperty
  );

  // Room Api
  routerAPI.get("/getAllRoom", roomsController.getAllRooms);
  routerAPI.post("/addRoom", roomsController.createRoom);
  routerAPI.put("/updateRoom/:id", roomsController.updateRoom);
  routerAPI.delete("/deleteRoom/:id", roomsController.deleteRoom);

  // Use the API router
  app.use("/", routerAPI);
};

module.exports = initApiRouter;
