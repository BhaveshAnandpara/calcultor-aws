var express = require("express");
var app = express();
const router = express.Router();
const path = require("path");

const {db} = require('../index')

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
        console.error('Error querying the database:', err);
        res.status(500).send('Error querying the database');
        return;
      }
      else{
        res.json(req.results);
      }
    })

      // Handle results
      res.json(req.body);

    // res.json(req.body)

  } catch (err) {}
});

module.exports = router;
