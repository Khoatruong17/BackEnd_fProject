require("dotenv").config();
const mongoose = require("mongoose");

const dbState = [
  {
    value: 0,
    label: "disconnect",
  },
  {
    value: 1,
    label: "connected",
  },
  {
    value: 2,
    label: "connecting",
  },
];

const connection = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGOOSE);
    const state = Number(mongoose.connection.readyState);
    console.log(dbState.find((f) => f.value == state).label, "to db");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

module.exports = connection;
