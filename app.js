const express = require('express')
const app = express()

const mongoose = require('mongoose')
require('dotenv/config')

const bodyParser = require('body-parser')
const snacksRoute = require('./routes/snacks')

app.use(bodyParser.json())
app.use('/snacks', snacksRoute)

app.get('/', (req, res)=>{
    res.send('Homepage')
})


try{
    mongoose.connect(process.env.DB_CONNECTOR)
    console.log('Your mongoDB is now connected!!')
} catch(err) {
    console.log(err)
}

app.listen(3000, ()=>{
    console.log('Server is up and running! yay')
})
