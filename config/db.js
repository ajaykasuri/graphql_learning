const mysql=require('mysql2/promise')
require("dotenv").config()
console.log("Database:", process.env.DB_DATABASE);
const pool=mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    database:process.env.DB_DATABASE,
    queueLimit:0,
    connectionLimit:10,
    waitForConnections:true
});

(async()=>{
    try{
    const connection=await pool.getConnection()
     console.log(" MySQL connected successfully!");
    const[result]=await connection.query("SELECT 1")
    if (result) console.log(" Connection test query successful.");
    connection.release();
    }
    catch(err){
         console.error(" MySQL connection failed!");
      console.error("Error details:", err.message);
      process.exit(1); 
    }
})()
 module.exports = pool;