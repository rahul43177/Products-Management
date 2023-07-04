const jwt = require('jsonwebtoken')

const authenticate = async function(req,res,next) {
    try { 
        const token = req.headers['x-api-key']
        if(!token) return res.status(400).send({status : false , message : "Invalid token"})
        const decodedToken = jwt.verify(token , 'secret-key')
        req.decodedTokenId = decodedToken.userId
        next()
    } catch(error) {
        res.status(500).send({status : false , message : error.message})
    }
}

module.exports = {authenticate}