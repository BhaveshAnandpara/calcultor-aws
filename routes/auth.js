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

//query function

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

    if( email == "" || email == null || email == undefined ) return res.status(500).json('email cannot be empty')
    if( password == "" || password == null || password == undefined ) return res.status(500).json('password cannot be empty');

    let userExists = await query(`select count(id) as count from user where email='${email}';`)
    userExists = userExists[0].count
    if(userExists != 0) return res.status(200).json("user already exists. try logging in")


    query(`insert into user values(NULL, '${email}' , '${password}');`).catch((err)=>{
      res.status(500).json(`error occured in mysql , ${err}`)
    })

    res.status(200).json('user added successfully')


  } catch (err) {
	console.log(err)
	res.status(500).json(err);

  }
});

router.post("/login" , async(req,res)=>{

	try{

		const {email ,password} = req.body
		console.log( {email,password} );


	        if( email == "" || email == null || email == undefined ) return res.status(500).json('email cannot be empty')
                if( password == "" || password == null || password == undefined ) return res.status(500).json('password cannot be empty');

		let userExists = await query(`select count(id) as count, password from user where email='${email}';`)

		console.log(userExists)

		let pass = userExists[0].password
		userExists = userExists[0].count
		if(userExists == 0) return res.status(200).json("Invalid Email")

		if( pass !== password ) return res.status(200).json("Inavlid Password")

		res.status(200).json("Log In Successfull");


	}
	catch(err){
		console.log(err)
		res.status(500).json(err)
	}

})

module.exports = router;
