var express = require("express");
var app = express();
const router = express.Router();
const path = require("path");
const mysql = require('mysql2');


// Your MySQL RDS database configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: 'admin',
  password: process.env.DB_PASS,
  database: 'calculator_db',
  port:3306
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  }
});

router.get("/signup", async (req, res) => {
  res.sendFile(path.join(__dirname, "../signup.html"));
});

router.get("/login", async (req, res) => {
  res.sendFile(path.join(__dirname, "../login.html"));
});

router.post("/signup", async (req, res) => {
  try {

    db.query('SELECT * FROM user', (err, results) => {

      if (err) {
          console.log(err);
          console.error('Error querying the database:', err);
          res.status(500).send('Error querying the database');
        return;
      }
      else{
        console.log("ok");
        res.json(req.results);
      }
    })

    console.log("Nothing happend");
      // Handle results
      res.json(req.body);

    // res.json(req.body)

  } catch (err) {}
});

module.exports = router;
