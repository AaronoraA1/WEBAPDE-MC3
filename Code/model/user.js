const mongoose = require("mongoose")

var tagSchema = mongoose.Schema({
    
    name : {
        type: String,
        required : true
    },
//    title : String,
    author : {
        type: Array,
        limit: 1,
        items: userSchema
},
  post:{
        type: Array,
        limit: 1,
        items: postSchema
    }    
})

var postSchema = mongoose.Schema({
    
    title: {
        type : String,
        required : true
    },
    
    date:{
        type: String
    },
    
    url: {
        type : String,
        required : true
    },
    originalFileName:{
        type: String
    },
    author : {
        type: Array,
        items: userSchema
    },
    
    description:{
        type : String
    },
    
    privacy: {
        type: Boolean,
    },
    
    tags: {
        type: Array,
        items: tagSchema
    }
})


var userSchema = mongoose.Schema({    
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required: true
    },    
    post:{
        type: Array,
        items: postSchema
    }
    
})

var User = mongoose.model("user", userSchema)


exports.find = function(userName){
  return new Promise(function(resolve, reject){
      User.findOne({username : userName}).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.delete = function(id){
  return new Promise(function(resolve, reject){
    User.remove({
      _id : id
    }).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.create = function(user){
  return new Promise(function(resolve, reject){
    var u = new User(user)
    u.save().then((newUser)=>{
      resolve(newUser)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.getAll = function(){
  return new Promise(function(resolve, reject){
    User.find().then((posts)=>{
      resolve(posts)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.edit = function(username , update){
    return new Promise(function(resolve, reject){
   User.findOne({_id : id }).then((post)=>{
            User.post.title = update.title
            User.post.description = update.description
            User.post.privacy = update.privacy
            User.post.tags = update.tags
            User.post.save()
    }, (err)=>{
        console.log("could not find user")
    })
  })
}


