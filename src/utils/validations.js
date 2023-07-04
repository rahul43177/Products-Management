const mongoose = require('mongoose')

const ObjectIdCheck = (id) =>{
    return mongoose.Types.ObjectId.isValid(id)
}


moudle.exports = {ObjectIdCheck}