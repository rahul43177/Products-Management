const bcrypt = require('bcrypt')

const hashedPassword = async function(password) {
    try {
         let salt = await bcrypt.genSalt();
         const hashedPassword = await bcrypt(password, salt)
         return hashedPassword
    } catch(error) {
        res.status(500).send({status : false , message : "Hashpassword error"})
    }
}
//====================================
const comparePassword = async function(password , hashedPassword) {
    return bcrypt.compare(password , hashedPassword)
}




module.exports = {hashedPassword , comparePassword}