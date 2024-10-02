const express = require("express");
const connection = require("./config/database");
const apiRouter = require("./routers/apiRouter");
const errorHandler = require("./middleware/errorHandler");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_MONGOOSE,
      collectionName: " sessions",
    }),
    cookie: {
      maxAge: 600000, // 10 minutes
      secure: false, // set to true if your app is behind a reverse proxy (like a Nginx)
      httpOnly: true, // prevent client-side JS from accessing the cookie
      sameSite: true, // recommended for secure cookies
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Initialize API routes
apiRouter(app);

// Default 404 handler
app.use((req, res) => {
  return res.status(404).send("404 Not Found");
});

app.listen(port, async () => {
  try {
    await connection();
    console.log(`App is running at ${port}`);
  } catch (err) {
    console.log(">>> Err when starting server: " + err);
  }
});
