const express = require('express');
const cors = require('cors');
const fs = require('fs');
const mysql = require('mysql2')
const bodyparser = require('body-parser')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const app = express();
require('dotenv').config();

app.use(bodyparser.json())

// CORS for react app, assuming port 3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))


/**
 * @swagger
 * /:
 *  get:
 *      summary: the first ever route
 *      description: to get to the home
 *      responses:
 *          200:
 *              description: return the main home
 */



const options = {
    definition: {
        openapi : '3.0.0',
        info : {
            title: 'API server test',
            version: '1.0.0'
        },
        servers : [
            {
                url: 'http://localhost:3030/'
            }
            
        ]
    },
    apis: ['./src/server.js']
}

const swaggerSpec = swaggerJsDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec) )


let HOST = process.env.HOST;
let USER = process.env.USER;
let PASSWORD = process.env.PASSWORD;
let DATABASE = process.env.DATABASE;
let PORT= process.env.DATABASEPORT;

const mysqlConnection = mysql.createConnection({
    host:HOST,
    user:USER,
    password:PASSWORD,
    database: DATABASE,
    port:PORT
})

/** 
 * @swagger
 *  components:
 *      schema:
 *          user:
 *              type: object
 *              properties:
 *                  id:
 *                      type:integer
 *                 name:
 *                      type: string
 *                  username:
 *                      type:string
 *                  password:
 *                      type:string
 *      
*/


/**
 * @swagger
 * /api/users:
 *  get:
 *      summary: gets request
 *      description: to return all the users
 *      responses:
 *          200:
 *              description: 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                                  $ref '#components/schema/user
*/



app.get('/', (req, res) => {    
    res.send("Welcome home")
  })

  
app.get('/api/users', (req, res) => {

    try {
        mysqlConnection.query(" select * from users", (err, rows, fields) => {
            if(err){
                res.send(err).status(400)
            }else{
                res.json(rows).status(200)
            }
        })
    } catch (error) {
        res.send(error).status(500)    
    }
  
})

app.get('/api/users/:id', (req, res) => {
  
    try {
        mysqlConnection.query(" select * from users where id=?",[req.params.id], (err,results) => {
            if(err){
                res.send(err).status(400)
            }
            else if(results.length === 0){ res.send("User does not exist").status(400)}
            else{
                res.json(results[0]).status(200)
                console.log(results.length)
            }
            
        })
    } catch (error) {
        res.send(error).status(500)   
    }
 
})

app.delete('/api/users/:username', (req, res) => {
  
    try {
        mysqlConnection.query(
            "DELETE FROM users WHERE username = ?", [req.params.username], (err, results) =>{
                if(err){
                    res.send(err).status(400)
                }
                else{
                    res.json({"message":"record deleted"}).status(204);
                }  
            }
            )
            
    } catch (error) {
        console.log(error)
        res.send(error).status(500) 
    }
    
})

app.post('/api/users/', (req, res) => {
  
    let newUser =[[req.body.name, req.body.username, req.body.password]]

    try {
        mysqlConnection.query("insert into users (name,username,password) values( ? ) ", newUser, (err, results) =>{
            if (err) {
                res.send(err).status(400)
            } else {
                res.json({"message":"record inserted"}).status(201)
            }
        })
        
    } catch (error) {
        console.log(error)
        res.send(error).status(500) 
    } 
})

app.put('/api/users/', (req, res) => {

    try {

        mysqlConnection.query(" select * from users where username=?",[req.params.username], (err, rows, fields) => {
            if( rows.length === 0){
                res.send("user does not exist").status(400)
            }else{
                mysqlConnection.query(`UPDATE users SET name = '${req.body.name}' WHERE username = '${req.body.username}'`, (err, results) =>{
                    if (err) {
                        res.send(err).status(400)
                    } else {
                        res.json({"message":"record updated"}).status(201)
                    }
                })
            }
            
        })


       
        
    } catch (error) {
        console.log(error)
        res.send(error).status(500) 
    } 

})



//port
const port = process.env.port || 3030
if (require.main === module) {
  app.listen(port, () => console.log(`API server listening on port: ${port} !`))
}
