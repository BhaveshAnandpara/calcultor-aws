var express = require("express");
var app = express();
const router = express.Router();
const path = require("path");
const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const  { createClient } = require('redis')

const client = createClient({url:'redis://redis-cache.nqwxcv.ng.0001.aps1.cache.amazonaws.com:6379'})
client.on('error', err=>{ console.log(err) })
const runClient = async ()=>{ await client.connect()};
runClient();

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

		let res = await client.hGetAll(token).catch(err=>{ console.log(err) })
		console.log(res)
		if( res != null && res != undefined ) resolve(res);

		let user = await jwt.verify(token, process.env.HASHSECRET)
		console.log("user : " , user)

		console.log("setting cache")
		await client.hSet(token, user).then(()=>{ 

			resolve(user)

		 }).catch(err=>console.log(err))
		

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

     //console.log(req.headers['x-access-token'])

     let user = await verifyUser( req.headers['x-access-token'] ).catch(err=> res.status(500).json(err))

     const { expression, result } = req.body;

     let user_id = await query( `select id from user where email='${user.email}'` )

	const date = new Date();
	let curr = date.toISOString().slice(0, 19).replace('T', ' ');

    let data =  await  query( `insert into history( id, user_id, expression, result, history_date)  values ( NULL, ${user_id[0].id}, '${expression}' , ${result}, '${curr}' );` ).catch(err=>{ throw Error(err)  })
	
	res.status(200).json('data added successfully')

   } catch (err) {
 	console.log(err)
 	res.status(500).json(err);

   }

});

router.get( '/history', async(req,res)=>{

	try{ 

		let user = await verifyUser(req.headers['x-access-token']).catch(err=>res.status(500).json('Not Authorized'));

		const user_id = await query( `select id from user where email='${user.email}'` );

		const history = await query(`select expression, result, history_date from history where user_id=${user_id[0].id};`)
		res.status(200).json(history);

	}catch(err){

		console.log(err)
		res.status(500).json([])

	}

} )


module.exports = router;
