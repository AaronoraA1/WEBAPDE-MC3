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
var moment = require('moment');
const router = express.Router()

const urlencoder = bodyparser.urlencoded({
    extended: false
})

const UPLOAD_PATH = path.resolve(__dirname, "uploads")
const upload = multer({
  dest: UPLOAD_PATH,
  limits: {
    fileSize : 10000000,
    files : 2
  }
})

router.use("/post", require("./post"))
router.use("/user", require("./user"))




router.get("/" , urlencoder, (req,res) =>{
    
    console.log("-------------------------------------------------------------")
    if(req.session.user){
        Post.getAll().then((post)=>{
       res.render("index.hbs", {
           user: req.session.user,
           posts: post.reverse()
       })
   }, ()=>{
            console.log("User does not exist")
        }) 
    }
    else{
         Post.getAll().then((post)=>{
        res.render("index.hbs", {
           posts: post.reverse()
       })
    }, ()=>{
            console.log("Error")
        }) 
    }

})

router.get("/profile", urlencoder, (req,res) =>{
    console.log("/PROFILE")
     Post.find(req.session.user.username).then((post)=>{
       res.render("profile.hbs", {
           user: req.session.user,
           posts: post.reverse()
       })
   }, ()=>{
            console.log("User does not exist")
        }) 
} )
        


router.get("/photo/:id", (req, res)=>{
  Post.findImage(req.params.id).then((doc)=>{
    fs.createReadStream(path.resolve(UPLOAD_PATH, doc.url)).pipe(res)
  }, (err)=>{
    console.log(err)
    res.sendStatus(404)
  })
})



module.exports = router