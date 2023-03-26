const express = require('express');
const { UserModel } = require('../model/model');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
let secretKey = "keytoken"


const userRouter = express.Router()

function authentication(req, res, next) {
    let token = req.headers.authorization.split(" ")[1]

    ///for bearer .. token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, secretKey, function (err, decoded) {
        if (decoded) {
            next()
        } else {
            res.send(err.message)
        }
    });
}
userRouter.get("/get", async (req, res) => {
    const data = await UserModel.find()

    res.status(200).send(data)
})


userRouter.post("/register", async (req, res) => {
    const { name, email, password, location, age } = req.body
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            const user = new UserModel({ name, email, password: hash, location, age, })
            await user.save()
            res.status(201).send({ "msg": "Registration Succesfull" })
        })

    } catch (error) {
        res.status(200).send({ "msg": "some error occured while adding user" })

    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                // result == true
                // console.log(result);
                if (result) {
                    res.status(200).send({ "msg": "login successfull", "token": jwt.sign({ "userID" : user._id}, secretKey, { expiresIn: "1hr" }) })

                }else{
                    res.status(401).send({"msg":"wrong input,login failed"})
                }
            });
        } else {
            res.status(400).send({ "msg": "login Failed" })

        }
    } catch (error) {
        res.status(200).send({ "msg": "some error occured while login" })

    }

})

userRouter.get("/random", authentication, (req, res) => {
    res.status(201).send({ "msg": "route is working properly fine" })
})



module.exports = userRouter