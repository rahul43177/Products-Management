const userModel = require('../model/user-model')
const validator = require('validator')
const bcrypt = require('bcrypt')
const {uploadFiles} = require('../aws/aws')
const jwt = require('jsonwebtoken')
const {ObjectIdCheck} = require('../utils/validations')
const { hashedPassword , comparePassword,} = require('../utils/bcrypt')

const userCreate = async (req,res)=>{
    try {
        let file = req.files
        const {fname , lname , email , profileImage , phone , password ,address} = req.body
        if(!fname || !lname || !email || !phone || !password) return res.status(400).send({status :  false , message : "Please enter all the fields"})
        if(!validator.isEmail(email)) return res.status(400).send({status : false , message  :"Please enter a valid email"})
        if(phone.length !== 10) return res.status(400).send({status : false , message : "Please enter a valid phone number "})
        if(password.length < 8 || password.length > 15) return res.status(400).send({status : false , message : "Please enter a valid password"}) 
        if (!address.shipping.street || !address.billing.street) {
            res.status(400).json({ status: false, message: 'Please enter address' });
        }
        if (!address.shipping.city || !address.billing.city) {
            res.status(400).json({ status: false, message: 'Please enter address' });
        }
        if (!address.shipping.pincode || !address.billing.pincode) {
            res.status(400).json({ status: false, message: 'Please enter address' });
        }
        if (file.length === 0) {
            res.status(400).json({ status: false, message: 'Please upload profile image' });
        } else {
            const userEmail = await userModel.findOne({email : email}) 
            if(userEmail) return res.status(400).send({status : false , message : "User already exist"})
            const userPhone = await userModel.findOne({phone : phone}) 
            if(userPhone) return res.status(400).send({status : false , message : "User already exist"})
            
            const url = await uploadFiles(file[0])
            
            const hasPassword = await hashedPassword(password)
            
            
            const userDetail = {
                fname : fname , 
                lname : lname , 
                phone : phone ,
                email : email , 
                password : hasPassword ,
                address : {
                    shipping : {
                        street : address.shipping.street ,
                        city : address.shipping.city ,
                        pincode : address.shipping.pincode
                    } ,
                    billing : {
                        street : address.billing.street ,
                        city : address.billing.city ,
                        pincode : address.billing.pincode
                    }
                } ,
                profileImage : url
            }
            const user = await userModel.create(userDetail)
            return res.status(201).send({status : true , message : "User created succesfully" , data : user})
        }
} catch(error) {
        res.status(500).send({status : false , message : error.message})
    }
}




const userLogin = async (req,res) => {
    try {
        const {email , password} = req.body

        if(!email || !password) return res.status(400).send({status : false , message : "Please enter the credentials "})

        if(!validator.isEmail(email)) return res.status(400).send({status : false , message : "Please enter the valid emailId"})

        if(password.length > 15  || password.length < 8) return res.status(400).send({status : false , message : "Please enter a valid password"})
        
        const user = await userModel.findOne({email : email})
        if(!user) return res.status(400).send({status : false , message : "User does not found"})

        const checkPassword = await comparePassword(password , user.password)
        if(!checkPassword) return res.status(400).send({status : false , message : "Invalid password"})

        const token = jwt.sign({userId : user._id} , "secret-key" , {expiresIn : "24h"})
        if(!token) return res.status(400).send({status : false , message : "Invalid token"})

        res.setHeaders('x-api-key' , token)
        return res.status(200).send({
            status : true  ,
            message : "User logged in successfully" ,
            data : {userId : user._id , token : token}
        })
    } catch(error) {
        res.status(500).send({status : false , message : error.message})
    }
}
const getUserById = async (req,res) =>{
    try {
        const userId = req.params.userId
        if(!userId) return res.status(400).send({status : false , message : "Please enter the UserID"})
        if(!ObjectIdCheck(userId)) return res.status(400).send({status : false , message :"Please enter the valid Id"})
        const user = await userModel.findById(userId)
        return res.status(200).send({status : true , message : "Success" , Data : user})
        
    } catch(error) {
        res.status(500).send({status : false , message: error.message })
    }
}

const updateUser = async function(req,res) {
    try {
        let userId = req.params.userId
        let data = req.body 
        if(!data) return res.status(400).send({status : false , message : "Please enter the data to be updated"})

        if(!userId) return res.status(400).send({status : false , message : "Please enter the userId"})

        if(!ObjectIdCheck(userId)) return res.status(400).send({status : false , message : "Please enter a valid UserId"})

        const user = await userModel.findById(userId)
        





    } catch(error) {
        res.status(500).send({Status : false , error : error.message})
    }
}






module.exports = {userCreate,userLogin , getUserById}