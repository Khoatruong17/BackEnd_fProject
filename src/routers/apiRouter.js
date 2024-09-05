const express = require("express");
const HelloController = require("../controllers/indexController");
const { register, login } = require('../controllers/authController');
const { check, validationResult } = require('express-validator');

const initApiRouter = (app) => {
  const routerAPI = express.Router();

  
  routerAPI.get("/", HelloController.Hello);
  routerAPI.post('/register', [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
  ], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
  }, register);


  routerAPI.post('/login', [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty()
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
  }, login);

  // Use the API router
  app.use("/api/", routerAPI);
};

module.exports = initApiRouter;

