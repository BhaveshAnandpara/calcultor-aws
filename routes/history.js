var express = require("express");
var app = express();
const router = express.Router();
const path = require("path");
const mysql = require("mysql2");

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

const verifyUser =  async (req,res)=>{
    console.log(req.cookies)
}

const query = (q) => {

    console.log(q);
  
    return new Promise((resolve , reject)=>{
      db.query(q, (err, results,fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results)
        }
      });
  
    })
  
};


router.post("/history", verifyUser ,  async (req, res) => {

//   try {

//     const { expression, result } = req.body;

//     let user_id = query( `insert into history values ( NULL, 9, "6+9" , 15.0, '2020-01-01' );` )
//     query( `insert into history values ( NULL, 9, "6+9" , 15.0, '2020-01-01' );` )

//   } catch (err) {
// 	console.log(err)
// 	res.status(500).json(err);

//   }
});


module.exports = router;
