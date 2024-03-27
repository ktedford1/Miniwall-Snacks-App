const express = require('express')
const router = express.Router()

const Snack = require('../models/Snack')
const verifyToken = require('../verifyToken')

// use POST to create an new entry in the 'snacks' collection
router.post('/', verifyToken, async(req, res)=>{

    const snackData = new Snack({
        owner:req.body.owner,
        title:req.body.title,
        description:req.body.description
    })
    try{
        const snackToSave = await snackData.save()
        res.send(snackToSave)
    } catch(err){
        res.send({message:err})
    }
})

// use GET and '/snacks' to retrieve all the snack records from the 'snacks' collection
router.get('/', verifyToken, async (req, res)=>{
    try {
        const snacks = await Snack.find()  // limit to a certain number?
        res.send(snacks)
    } catch(err) {
        res.send({message:err})
    }
})

// use GET and '/snacks/<id number>' to retrieve a specific snack record
router.get('/:snackId', verifyToken, async (req, res)=>{
    try {
        const snackById = await Snack.findById(req.params.snackId)  // .limit(5) or whatever number
        res.send(snackById)
    } catch(err) {
        res.send({message:err})
    }
})

// use PATCH and '/snacks/<id number>' to modify a specific snack record
router.patch('/:snackId', verifyToken, async (req, res)=>{
    try{
        const updateSnackById = await Snack.updateOne (
            {_id:req.params.snackId},
            {$set:{
                owner:req.body.owner,
                title:req.body.title,
                description:req.body.description
                }
            })
        res.send(updateSnackById)
    } catch(err) {
        res.send({message:err})
    }
})

// use DELETE and '/snacks/<id number>' to delete a specific snack record
router.delete('/:snackId', verifyToken, async (req, res)=>{
    try{
        const deleteSnackById = await Snack.deleteOne({_id:req.params.snackId})
        res.send(deleteSnackById)
    } catch(err) {
        res.send({message:err})
    }
})

module.exports = router
