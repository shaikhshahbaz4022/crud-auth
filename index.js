const express = require('express');
const connection = require('./connection/connection');
const postRouter = require('./routes/post.router');
const userRouter = require('./routes/user.router');
const swaggerJSdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const cors = require('cors');
require("dotenv").config()
const auth = require("./middleware/auth")
const app = express()
app.use(express.json())
app.use(cors())
//definition
const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Learning Swagger",
            version:"1.0.0"
        },
        servers:[
            {
                url:"http://localhost:4300"
            }
        ]
    },
    apis:["./Routes/*.js"]
}
//specification
const swaggerSpec= swaggerJSdoc(options)
//building UI
app.use("/documentation",swaggerUI.serve,swaggerUI.setup(swaggerSpec))

app.use("/users", userRouter)

// app.use(auth)
app.use("/notes",auth, postRouter)


app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("connection is success to DB");
    } catch (error) {
        console.log("some error occourd during connection");
    }
    console.log("server is connected to port 4300 ");
})