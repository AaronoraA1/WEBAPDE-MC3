const express = require("express")
const mongoose = require("mongoose")
const hbs = require("hbs")
const bodyparser = require("body-parser")
const path = require("path")
const crypto = require("crypto")
const Post = require("../model/post")
const User = require("../model/user")
const session = require("express-session")
const cookieparser = require("cookie-parser")
const multer = require("multer")
const fs = require("fs")
const router = express.Router()
var moment = require('moment');

const app = express()

const urlencoder = bodyparser.urlencoded({
  extended : true
})

router.post("/register", urlencoder, (req,res) =>{
    console.log("register")
    var username = req.body.username
    var password = req.body.password
   
    var hashepassword = crypto.createHash("md5").update(password).digest("hex")
    console.log("hashepasseword "+hashepassword)
    var newUser = {username,password}
    
    User.create(newUser).then((user)=>{
        console.log( user.username + "Logged")
        req.session.user = user
        res.redirect("/")
    }), (err)=>{
        console.log("MALIII")
        
    }

})

router.post("/login", urlencoder, (req,res) => {
    var userName = req.body.username

    console.log("login")
    User.find(userName).then((user)=>{
       req.session.user = user
       res.redirect("/")
    }, (err)=>{
        console.log("could not find user")
        res.redirect("/")
    })
})

router.get("/logout", urlencoder, (req,res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Succesfully destroyed session")
        }
    });
    res.redirect("/")
    
})

module.exports = router