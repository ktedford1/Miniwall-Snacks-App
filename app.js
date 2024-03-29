// code source: CSM-030, Lab 3, Part 1: Building the MiniPost REST microservice

const express = require('express')
const app = express()

const mongoose = require('mongoose')
require('dotenv/config')

const bodyParser = require('body-parser')
const snacksRoute = require('./routes/snacks')
const authRoute = require('./routes/auth')

app.use(bodyParser.json())
app.use('/api/snacks', snacksRoute)
app.use('/api/user', authRoute)

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
