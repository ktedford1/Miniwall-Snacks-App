// code based on: CSM-030, Lab 3, Part 1: Building the MiniPost REST microservice

const express = require('express')
const router = express.Router()

const Snack = require('../models/Snack')
const {snackpostValidation} = require('../validations/validation')
const verifyToken = require('../verifyToken')

// use POST to create an new entry in the 'snacks' collection
router.post('/', verifyToken, async(req, res)=>{

    // Validation #1: check user input
    const {error} = snackpostValidation(req.body)
    if (error) {
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // automatically add the userId and the username of the user to every snack post..
    // ..but the user should add the title and description
    const snackData = new Snack({
        owner:req.user._id,
        username:req.user.username,
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
        // sort the 'snacks' collection first on total number of likes (descending) and second on the post date (descending)
        const snacks = await Snack.aggregate ([
            { $addFields: { likesCount: { $size: "$likes" } } },
            { $sort: { likesCount: -1, date: -1} }
        ])                                                  // .limit(x) to limit the returned list to 'x' snack posts
        res.send(snacks)
    } catch(err) {
        res.status(500).send({message:"ordering didn't work"})
    }
})

// use GET and '/snacks/<id number>' to retrieve a specific snack record
router.get('/:snackId', verifyToken, async (req, res)=>{
    try {
        const snackById = await Snack.findById(req.params.snackId) 
        res.send(snackById)
    } catch(err) {
        res.send({message:err})
    }
})

// use PATCH and '/snacks/<id number>' to modify a specific snack record
router.patch('/:snackId', verifyToken, async (req, res)=>{
    try{
        // check if the user_id is same person as the 'username' who posted the snack
        const snack2patch = await Snack.findById(req.params.snackId)  
        
        if (snack2patch.owner.toString() !== req.user._id.toString()) {
            return res.status(401).send({message:"Access denied: only the registered owner can edit this post."})
        }        
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
        // check if the user_id is same person as the 'username' who posted the snack
        const snack2delete = await Snack.findById(req.params.snackId)  
        
        if (snack2delete.owner.toString() !== req.user._id.toString()) {
            return res.status(401).send({message:"Access denied: only registered owner can delete this post."})
        }
        const deleteSnackById = await Snack.deleteOne({_id:req.params.snackId})
        res.send(deleteSnackById)
    } catch(err) {
        res.send({message:err})
    }
})

// LIKES: use PATCH and '/snacks/<id number>/like' to add a 'LIKE' to a specific snack record
// add auth-token to header; nothing is required in the body

router.patch('/:snackId/like', verifyToken, async (req, res)=>{
    try{
        const snack2like = await Snack.findById(req.params.snackId)

        // check if the user_id is NOT!! the same person as the 'username' who posted the snack  
        if (snack2like.owner.toString() == req.user._id.toString()) {
            return res.status(401).send({message:"Access denied: you can't 'like' your own posts"})
        } 
        

        // check if the user_id has already liked the post
        let alreadyLiked = false;

        for (let i = 0; i < snack2like.likes.length; i++) {
            if (snack2like.likes[i].userId.toString() == req.user._id.toString()) {
                alreadyLiked = true;
                break;
            }
        }

        if (alreadyLiked) {
            return res.status(400).send({message:"You already liked this post - you can't like twice"})
        }
        

        // add a like to the likes array
        const updateSnackLike = await Snack.updateOne (
            {_id:req.params.snackId},
            {$push:{
                likes:{userId:req.user._id, date:new Date() }           
                }
            })
        res.send({message:"You liked this post!"})
    } catch(err) {
        res.send({message:err})
    }
})


// COMMENTS: use PATCH and '/snacks/<id number>/comment' to add a 'comment' to a specific snack record
// add auth-token to header; 

router.patch('/:snackId/comment', verifyToken, async (req, res)=>{
    try{
        const snack2comment = await Snack.findById(req.params.snackId)

        // check if the user_id is NOT!! the same person as the 'username' who posted the snack  
        if (snack2comment.owner.toString() == req.user._id.toString()) {
            return res.status(401).send({message:"Access denied: you can't 'comment' on your own posts!"})
        } 
        
        // check that the comment contains text and is not too long:
        const commentText = req.body.comment;
        if (!commentText || commentText.trim().length < 1) {
            return res.status(400).send({message:"You forgot to write a comment!"})
        }

        // add a comment to the comments array
        const updateSnackComment = await Snack.updateOne (
            {_id:req.params.snackId},
            {$push:{
                comments:{userId:req.user._id, date:new Date(), comment:req.body.comment }           
                }
            })
        res.send({updateSnackComment})
    } catch(err) {
        res.send({message:err})
    }
})

module.exports = router
