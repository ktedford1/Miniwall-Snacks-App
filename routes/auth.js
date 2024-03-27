const express = require('express')
const router = express.Router()

const User = require('../models/User')
const {registerValidation, loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.post('/register', async(req, res)=>{

    // Validation #1: check user input
    const {error} = registerValidation(req.body)
    if (error) {
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation #2: check if user already exists
    const userExists = await User.findOne({email:req.body.email})
    if (userExists) {
        return res.status(400).send({message: 'User already exists! Try again'})
    }

    // create a hashed version of the password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    // use POST to create an new entry in the 'users' collection
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.send(savedUser)
    } catch(err) {
        res.status(400).send({message:err})
    }

})

router.post('/login', async(req, res)=>{

    // Validation #1: check user input
    const {error} = loginValidation(req.body)
    if (error) {
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation #2: check if user already exists
    const user = await User.findOne({email:req.body.email})
    if (!user) {
        return res.status(400).send({message: 'User not found - so sorry'})
    }

    // Validation #3: check if user password is correct
    const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
    if (!passwordValidation) {
        return res.status(400).send({message:'Password is incorrect - try again'})
    }

    // If everything is correct, generate an auth token
    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({'auth-token':token})

})

module.exports=router