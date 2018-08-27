/* IMPORTS */
const express = require("express")
const mongoose = require("mongoose")
const hbs = require("hbs")
const bodyparser = require("body-parser")
const path = require("path")
const crypto = require("crypto")
//const{Schema} = require("./model/scheme.js")
const{Tag} = require(("./model/tag.js"))
const{Post} = require(("./model/post.js"))
const{User} = require(("./model/user.js"))
const session = require("express-session")
const cookieparser = require("cookie-parser")
const multer = require("multer")
const fs = require("fs")
var moment = require('moment');




moment().format();
 
/* SETUP */
const app = express()
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
app.use(bodyparser.json())
app.use(session({
    secret: "secret",
    name: "user",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000*60*60*24*7*3
    }
}))

app.use(cookieparser())
mongoose.Promise = global.Promise
mongoose.connect ("mongodb://localhost:27017/Memes",{
     useNewUrlParser: true
})
app.set("view-engine", "hbs")
app.use(express.static(__dirname+'/public'));


/* ROUTES */
app.get("/" , urlencoder, (req,res) =>{
    
    console.log("-------------------------------------------------------------")
    if(req.session.user){
        Post.find().then((post)=>{
       res.render("index.hbs", {
           user: req.session.user,
           posts: post
       })
   }, ()=>{
            console.log("User does not exist")
        }) 
    }
    else{
         Post.find().then((post)=>{
        res.render("index.hbs", {
           posts: post
       })
    }, ()=>{
            console.log("Error")
        }) 
    }

})


app.get("/profile", urlencoder, (req,res) =>{
    

    console.log("/PROFILE")
     Post.find({author:req.session.user.username}).then((post)=>{
       res.render("profile.hbs", {
           user: req.session.user,
           posts: post
       })
   }, ()=>{
            console.log("User does not exist")
        }) 
} ) 

app.post("/delete" , urlencoder, (req,res)=>{
    console.log("we gon delete boys")
    
    var Id = req.body.id 
        
   
    User.findOne({username : req.session.user.username}).then((user)=>{
        user.post.remove({_id: Id})
        user.save(user)
    }, (err)=>{
        console.log("could not find user")
    })
    
    
    
    Post.remove({_id : Id}).then(() =>{
        console.log("DELETED")
    })
    
    res.redirect("/profile")
})

app.post("/edit" , urlencoder, (req,res)=>{
    console.log("/EDIT")
    
    
    var tags = req.body.tags.split(",")

     if(req.body.private == 1){
        var val = true
    }
    else
        var val = false
   
    Post.findOne({_id : req.body.id }).then((post)=>{
        if(post){
            post.title = req.body.title
            post.description = req.body.description
            post.privacy = val
            post.tags = tags
            post.save()
        }
    }, (err)=>{
        console.log("could not find user")
    })
    
     User.findOne({username : req.session.user.username}).then((user)=>{
            User.post.title = req.body.title
            User.post.description = req.body.description
            User.post.privacy = val
            User.post.tags = req.body.tags
            User.post.save()
    }, (err)=>{
        console.log("could not find user")
    })
    
   
    res.redirect("/profile")
})
         
app.post("/upload", upload.single("url"),urlencoder, (req,res) =>{
    
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
    
    
    var newPost = new Post({
        title:req.body.title,  
        url: req.file.filename,
        originalFileName: req.file.originalname,
        description: req.body.description,
        privacy: val,
        tags :tags,
        date : date})
    
   
   
    newPost.author = req.session.user.username


    User.findOne({username : req.session.user.username}).then((user)=>{
        user.post.push(newPost)
        user.save(user)
    }, (err)=>{
        console.log("could not find user")
    })
  
    newPost.save().then((post)=>{
    }), (err)=>{
        console.log("Error when saving the post")
    }

     res.redirect("/")
    
})


app.get("/photo/:id", (req, res)=>{
  Post.findOne({_id: req.params.id}).then((doc)=>{
    console.log(doc.url)
    fs.createReadStream(path.resolve(UPLOAD_PATH, doc.url)).pipe(res)
  }, (err)=>{
    console.log(err)
    res.sendStatus(404)
  })
})



app.post("/search", urlencoder, (req,res) =>{
    var queryPost = Post
    
    console.log(req.body.search)
    Post.find({$or: [{title: req.body.search}, {author: req.body.search}, {tags: req.body.search}] }).then((post)=>{    
        if(req.session.user){
       res.render("index.hbs", {
           username: req.session.user.username,
           posts: post
    })
        }
                  
    else{
        res.render("index.hbs", {
           posts: post
       }) 
    }
    
        
    }, (err)=>{
        console.log("could not find user")
    })
    
})
    
app.post("/register", urlencoder, (req,res) =>{
    console.log("register")
    var username = req.body.username
    var password = req.body.password
   
    var hashepassword = crypto.createHash("md5").update(password).digest("hex")
    console.log("hashepasseword "+hashepassword)
    var newUser = new User({username,password})
    
    newUser.save().then((user)=>{
        console.log( user.username + "Logged")
        req.session.user = user
        res.redirect("/")
    }), (err)=>{
        console.log("MALIII")
        
    }

})


app.post("/login", urlencoder, (req,res) => {
    var userName = req.body.username

    console.log("login")
    User.findOne({username : userName}).then((user)=>{
        
       req.session.user = user
       console.log("YA BOI's USERNAME " + user.username)
       res.redirect("/")
        
    }, (err)=>{
        console.log("could not find user")
        res.redirect("/")
    })
})

app.get("/logout", urlencoder, (req,res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Succesfully destroyed session")
        }
    });
    res.redirect("/")
    
})


/* LISTEN */
app.listen(3000)
console.log("Listening")