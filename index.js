const express = require('express')
const app = express()
const bodyPaser= require('body-parser')
const dotenv = require('dotenv').config()
const mongoose = require("mongoose");
const Album = require('./src/Album')
const path = require('path')

// express setup
app.use(express.json())
app.use(bodyPaser.json())
app.use(bodyPaser.urlencoded({ extended: true }));

// database setup and connection
mongoose.set("strictQuery", false);
const mongodbURI = process.env.CONNECTIONSTRING
mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log('MongoDB and Mongoose connected!'))
.catch(error =>console.error('Error in connection!',error))

app.listen(process.env.PORT, () => {
    console.log("Listening on port: " + process.env.PORT);
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

app.get('/albums', async(req,res)=>{
    try {
        const albums = await Album.find()
        .exec()

        const count= await Album.count()

        res.json({
            data:albums,
        })
    } catch (error) {
        res.status(500).json({messege: "error in getting customers"})
    }
})