const express = require('express');
const connection = require("./config/database");
const apiRouter = require("./routers/apiRouter");

const app = express();
const port = process.env.PORT || 10000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
