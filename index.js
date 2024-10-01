const express = require("express");
const { norFound, errorHandler } = require("./middlewares/errors");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const ConnectToDatabase = require("./config/db");

// connection to Database
ConnectToDatabase();

// Init express
const app = express();
// Apply Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Helmet
app.use(helmet());

// cors Policy acss for any domen
app.use(cors());

// set view Engine
app.set("view engine", "ejs");

// Routes
app.use("/",async(res,req)=>{
    res.res.send("Welcome")
})
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/password", require("./routes/password"));
app.use("/api/upload", require("./routes/upload"));

// Error Handlers Middlewares
app.use(norFound);
app.use(errorHandler);

//runing the server
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(
    `Server is running in ${
      process.env.MODE_ENV || "development"
    } mode http://localhost:5000`
  )
);
