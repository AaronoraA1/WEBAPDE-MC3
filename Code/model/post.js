
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

var Post = mongoose.model("post", postSchema) 


exports.find = function(find){
  return new Promise(function(resolve, reject){
      console.log("BRUH" + find)
      Post.find({$or: [{title: find}, {author: find}, {tags: find}] }).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.findProfile = function(find){
  return new Promise(function(resolve, reject){
      console.log("BRUH" + find)
      Post.find({$or: [{title: find},{tags: find}] }).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.find = function(find){
  return new Promise(function(resolve, reject){
      console.log("BRUH" + find)
      Post.find({$or: [{title: find}, {author: find}, {tags: find}] }).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.delete = function(id){
  return new Promise(function(resolve, reject){
    Post.remove({
      _id : id
    }).then((result)=>{
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.create = function(post){
  return new Promise(function(resolve, reject){
    var p = new Post(post)
    p.save().then((newPost)=>{
      resolve(newPost)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.getAll = function(){
  return new Promise(function(resolve, reject){
    Post.find().then((posts)=>{
      resolve(posts)
    }, (err)=>{
      reject(err)
    })
  })
}
exports.edit = function(id , update){
    return new Promise(function(resolve, reject){
   Post.findOne({_id : id }).then((post)=>{
            post.title = update.title
            post.description = update.description
            post.privacy = update.privacy
            post.tags = update.tags
            post.save()
    }, (err)=>{
        console.log("could not find user")
    })
  })
}
exports.findImage = function(find){
  return new Promise(function(resolve, reject){
      Post.findOne({_id : find}).then((result)=>{     
      resolve(result)
    }, (err)=>{
      reject(err)
    })
  })
}
    