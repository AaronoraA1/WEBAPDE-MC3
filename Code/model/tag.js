const mongoose = require("mongoose")

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



var tagSchema = mongoose.Schema({
    
    name : {
        type: String,
        required : true
    },
    post:{
        type: Array,
        limit: 1,
        items: postSchema
    }  
})

var Tag = mongoose.model("tag", tagSchema)

module.exports = {
    Tag
}