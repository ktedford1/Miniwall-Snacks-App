const mongoose = require('mongoose')

const SnackSchema = mongoose.Schema({
    owner:{
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
    }
})

module.exports = mongoose.model('snacks', SnackSchema)
