const express = require('express');
const cors = require('cors');
const fs = require('fs');
const mysql = require('mysql2')
const bodyparser = require('body-parser')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const app = express();
require('dotenv').config();
const axios = require('axios');
const htmlToImage = require('html-to-image');

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

// const mysqlConnection = mysql.createConnection({
//     host:HOST,
//     user:USER,
//     password:PASSWORD,
//     database: DATABASE,
//     port:PORT
// })

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

/**
 *     htmlToImage.toJpeg(CertificateTemplate , {quality: 0.96})
    .then( (dataUrl) => {
        let img = new Image();
        img.src = dataUrl;
        res.sendFile(img);
       // donwload(dataUrl,"img.png");
        
    }).catch ( (err) => {
        console.log(err);
        res.send("Error");
    })
 */




const CertificateTemplate = `
<>
<div class="card">
  <img src="img.jpg" alt="John" style="width:100%">
  <h1>John Doe</h1>
  <p class="title">CEO & Founder, Example</p>
  <p>Harvard University</p>
  <a href="#"><i class="fa fa-dribbble"></i></a>
  <a href="#"><i class="fa fa-twitter"></i></a>
  <a href="#"><i class="fa fa-linkedin"></i></a>
  <a href="#"><i class="fa fa-facebook"></i></a>
  <p><button>Contact</button></p>
</div>

<style>
.card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    max-width: 300px;
    margin: auto;
    text-align: center;
  }
  
  .title {
    color: grey;
    font-size: 18px;
  }
  
  button {
    border: none;
    outline: 0;
    display: inline-block;
    padding: 8px;
    color: white;
    background-color: #000;
    text-align: center;
    cursor: pointer;
    width: 100%;
    font-size: 18px;
  }
  
  a {
    text-decoration: none;
    font-size: 22px;
    color: black;
  }
  
  button:hover, a:hover {
    opacity: 0.7;
  }

</style>
</>
`

async function createImage() {
    const payload = { html: CertificateTemplate,
    css: "div { background-color: blue; }" };
  
    let headers = { auth: {
      username: '79cc3397-0c5f-4f45-a920-e52450d46e63',
      password: '678d7481-95a7-49fc-a91b-b8aca1a7e6d7'
    },
    headers: {
      'Content-Type': 'application/json'
    }
    }
    try {
      const response = await axios.post('https://hcti.io/v1/image/?dl=1', JSON.stringify(payload), headers);
      console.log(response.data.url);
    } catch (error) {
      console.error(error);
    }
  }




app.get('/', (req, res) => {    
    res.send("Welcome home")
    createImage()  

  })

  
/*app.get('/api/users', (req, res) => {

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

})*/



//port
const port = process.env.port || 3030
if (require.main === module) {
  app.listen(port, () => console.log(`API server listening on port: ${port} !`))
}
