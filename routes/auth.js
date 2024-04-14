var express = require("express");
var app = express();
const router = express.Router();
const path = require("path");
const mysql = require("mysql2");
const { rejects } = require("assert");

// Your MySQL RDS database configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: "admin",
  password: process.env.DB_PASS,
  database: "calculator_db",
  port: 3306,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  }
});

//query function

const query = (q) => {

  console.log(q);

  return new Promise((resolve , reject)=>{
    
    db.query(q, (err, results) => {
      console.log(err);
      console.log( [results] );
      if (err) {
        reject(err);
      } else {
        resolve(results)
      }
    });

  })

};

router.get("/signup", async (req, res) => {
  res.sendFile(path.join(__dirname, "../signup.html"));
});

router.get("/login", async (req, res) => {
  res.sendFile(path.join(__dirname, "../login.html"));
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log({email , password});

    let userExists = await query(`select count(id) as count from user where email='${email}';`)
    if(userExists != 0) res.send(200).json("user already exists")

    console.log("new user");

    query(`insert into user values(NULL, '${email}' , '${password}');`).catch((err)=>{
      res.status(500).json(`error occured in mysql , ${err}`)
    })

    console.log("done");

    res.send(200).json('user added successfully')


  } catch (err) {}
});

module.exports = router;
