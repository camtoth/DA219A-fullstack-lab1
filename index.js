const express = require('express')
const app = express()
const bodyPaser= require('body-parser')
const dotenv = require('dotenv').config()
const mongoose = require("mongoose");
const Album = require('./src/Album')

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
