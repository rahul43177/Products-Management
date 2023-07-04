const express = require('express')
const app = express()
const mongoose = require('mongoose')
const route = require('./route/route.js')
const multer = require('multer')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb+srv://rahul4317:L0Jf8dKS6E1sKl1C@cluster0.dwi1fgs.mongodb.net/Products-Management-DB')
.then(()=>console.log(`MongoDB is connected`))
.catch(error=>console.log(error))

app.use(multer().any())

app.use('/',route)

app.listen(5000 , function(){
    console.log(`The server is running on the port 5000`)
})