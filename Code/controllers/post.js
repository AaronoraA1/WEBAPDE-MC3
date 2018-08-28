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
const{Posts} = require(("../model/post.js"))
const multer = require("multer")
const fs = require("fs")
const router = express.Router()
var moment = require('moment');




const UPLOAD_PATH = path.resolve(__dirname, "uploads")
const upload = multer({
  dest: UPLOAD_PATH,
  limits: {
    fileSize : 10000000,
    files : 2
  }
})


const app = express()


const urlencoder = bodyparser.urlencoded({
  extended : true
})

//router.use("/", require("./index"))

router.post("/searchIndex", urlencoder, (req,res) =>{
    var queryPost = Post
    
    console.log(req.body.search)
    Post.find(req.body.search).then((post)=>{
        res.render("index.hbs", {
           user: req.session.user,
           posts: post
       })     
    }), (err)=>{
        console.log("could not find user")
    }
    
})

router.post("/searchProfile", urlencoder, (req,res) =>{
    var queryPost = Post
    
    console.log(req.body.search)
        console.log(req.body.search)
    Post.findProfile(req.body.search, req.session.user).then((post)=>{
       res.render("profile.hbs", {
           user: req.session.user.username,
           posts: post
    })
    }), (err)=>{
        console.log("could not find user")
    }
    
})
router.post("/delete" , urlencoder, (req,res)=>{
    console.log("we gon delete boys")
    
    var Id = req.body.id 
        
   
    User.find(req.session.user.username).then((user)=>{
        user.post.remove({_id: Id})
        user.save(user)
    }, (err)=>{
        console.log("could not find user")
    })
    
    
    
    Post.delete(Id).then(() =>{
        console.log("DELETED")
    })
    
    res.redirect("/profile")
})

router.post("/edit" , urlencoder, (req,res)=>{
    console.log("/EDIT")
    var title = req.body.title
    var description = req.body.description
    
    var tags = req.body.tags.split(",")

     if(req.body.private == 1){
        var val = true
    }
    else
        var val = false
        
    var update = {
        title:title,  
        description:description,
        privacy: val,
        tags :tags
    }
   
    Post.edit(req.body.id,update).then((post)=>{
      console.log("successfully updated")
    }, (err)=>{
        console.log("could not find user")
    })
    
     User.find(req.session.user.username, update).then((user)=>{
         console.log("successfully updated")
    }, (err)=>{
        console.log("could not find user")
    })
    
   
    res.redirect("/profile")
})
         
router.post("/upload", upload.single("url"),urlencoder, (req,res) =>{
    
//    var title = req.body.title
//    var url = req.file.filename
//    var id = Math.floor((Math.random() * 50) + 1);
    var d = Date.now()
    
    var date = moment.duration(-(Date.now() - d), "days").humanize(true);
    
    var tags = req.body.tags.split(",")
    
    if(req.body.private == 1){
        var val = true
    }
    else
        var val = false

        
    var newPost = {
        title:req.body.title,  
        url: req.file.filename,
        originalFileName: req.file.originalname,
        description: req.body.description,
        privacy: val,
        tags :tags,
        date : date,
    }

    newPost.author = req.session.user.username


    User.find(req.session.user.username).then((user)=>{
        user.post.push(newPost)
        user.save(user)
    }, (err)=>{
        console.log("could not find user")
    })
  
    Post.create(newPost).then((post)=>{
        console.log("successfully uploaded")
    }), (err)=>{
        console.log("Error when saving the post")
    }

     res.redirect("/profile")
    
})
module.exports = router
