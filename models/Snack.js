const mongoose = require('mongoose')

const SnackSchema = mongoose.Schema({
    owner:{
        // unique userId assigned by MongoDB; user does not have to fill this in
        type:String,
        required:true
    },
    username:{
        // user does not have to fill this in - will be automatically entered
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
        min:5,
        max:100
    },
    description:{
        type:String,
        required:true,
        min:5,
        max:1000
    },
    date:{
        // user does not have to fill in dates - all dates will be automatically entered
        type:Date,
        default:Date.now
    },
    likes: [{
        // likes and comments are optional and can only be filled in by users other than the owner of this post
        userId:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            default:Date.now
        }
    }],
    comments: [{
        userId:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            default:Date.now
        },
        comment:{
            type:String,
            required:true
        }
    }]
})

module.exports = mongoose.model('snacks', SnackSchema)
