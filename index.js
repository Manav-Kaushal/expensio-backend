const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { restrictToLoggedInUserOnly } = require("./middlewares/auth");

dotenv.config({ path: "./config/config.env" });

connectDB();

const transactions = require("./routes/transactions");
const users = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json()); // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/transactions", restrictToLoggedInUserOnly, transactions);
app.use("/api/auth", users);

// Set port, listen for requests
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
