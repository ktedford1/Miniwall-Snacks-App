const mongoose = require('mongoose')

const SnackSchema = mongoose.Schema({
    owner:{
        // unique userId assigned by MongoDB; user does not have to fill this in
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    likes: [{
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
