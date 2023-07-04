const userModel = require('../model/user-model')
const validator = require('validator')
const bcrypt = require('bcrypt')
const {uploadFiles} = require('../aws/aws')
const jwt = require('jsonwebtoken')
const {ObjectIdCheck} = require('../utils/validations')

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
            
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password , salt) 
            
            const userDetail = {
                fname : fname , 
                lname : lname , 
                phone : phone ,
                email : email , 
                password : hashedPassword ,
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



module.exports = {userCreate}