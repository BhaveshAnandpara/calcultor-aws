const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
var bodyParser = require("body-parser");
const mysql = require('mysql2');
const path = require('path');

const AuthRoute = require('./routes/auth');

// Your MySQL RDS database configuration
const db = mysql.createConnection({
  host: 'calculator-db.c96ci228cb5p.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'vnljD6wWOzhvNeotZ3Zv',
  database: 'calculator-db',
  port:3306
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Middlewares
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("./"));
app.use(
  cors()
);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie"
  );

  res.header("Access-Control-Expose-Headers", "Cookie");

  next();
});



// app.get('/signup', (req, res) => {
//     res.sendFile(path.join(__dirname, './signup.html'));
// });


// Routes
app.use("/auth", AuthRoute);

// connection
const port = 8080;
app.listen(port, () => console.log(`Listening to port ${port}`));