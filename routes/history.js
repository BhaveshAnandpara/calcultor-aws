var express = require("express");
var app = express();
const router = express.Router();
const path = require("path");
const mysql = require("mysql2");
const jwt = require('jsonwebtoken');

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

const verifyUser =  async (token)=>{

    return new Promise( async ( resolve ,reject ) =>{

	try{

		let user = await jwt.verify(token, process.env.HASHSECRET)
		resolve(user)

	}catch(err){

		reject(err)

	}

    })
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


router.post("/history", async (req, res) => {


		

   try {

     let user = await verifyUser( req.headers['x-access-token'] ).catch(err=> res.status(500).json(err))

     const { expression, result } = req.body;

     let user_id = query( `select id from user where email='${user.email}'` )
	console.log(user_id[0]);

     query( `insert into history values ( NULL, ${user_id[0].id}, ${expression} , ${result}, '2020-01-01' );` )

   } catch (err) {
 	console.log(err)
 	res.status(500).json(err);

   }

});


module.exports = router;
