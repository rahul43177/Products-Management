const jwt = require('jsonwebtoken')
const userModel = require('../model/user-model')

const authorisation = async function(req , res , next){
    try  {
        const decodedTokenId = req.decodedTokenId
        if(req.params.userId) {
            const user = await userModel.findById(req.params.userId)
            if(!user) return res.status(400).send({status : false , message : "No user with this ID is found"})
            if(req.params.userId !== decodedTokenId) return res.send({status : false , message : "You are not authorised"})
            next()
        }
    } catch(error){
        res.status(500).send({status : false , error : error.message })
    }
}

module.exports ={authorisation}