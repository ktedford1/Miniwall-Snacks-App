const express = require('express')
const router = express.Router()

const Snack = require('../models/Snack')

// use POST to create an new entry in the 'snacks' collection
router.post('/', async(req, res)=>{

    const snackData = new Snack({
        owner:req.body.owner,
        title:req.body.title,
        description:req.body.description,
    })
    try{
        const snackToSave = await snackData.save()
        res.send(snackToSave)
    } catch(err){
        res.send({message:err})
    }
})


router.get('/', async (req, res)=>{
    try {
        const snacks = await Snack.find()  // limit to a certain number?
        res.send(snacks)
    } catch(err) {
        res.send({message:err})
    }
})

router.get('/:snackId', async (req, res)=>{
    try {
        const snackById = await Snack.findById(req.params.snackId)  // .limit(5) or whatever number
        res.send(snackById)
    } catch(err) {
        res.send({message:err})
    }
})

module.exports = router
