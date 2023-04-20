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
.catch(error =>console.error("ERROR: couldn't establish connection!", error))

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

        res.json(
            albums,
        )
    } catch (error) {
        res.status(500).json({message: "ERROR: couldn't fetch albums"})
    }
})

app.get('/albums/:title', async(req,res)=> {
    try {
        const album = await Album.find({title: req.params.title})
        if (album.length > 0)
            res.status(201).json(album)
        else 
            res.status(404).json({message: "ERROR: couldn't find album with this title"})
    } catch (error) {
        res.status(500).json({message: "ERROR: couldn't fetch album"})
    }
})


app.post('/album', async(req,res)=>{
    const title= req.body.title
    const artist = req.body.artist
    const year = req.body.year

    if (!title || !artist || !year){
        res.status(400).json({message: "ERROR: please specify album title, artist and year"})
    }

    const newAlbum= new Album({
        title:title,
        artist:artist,
        year:year
    })
    try {
        const album = await newAlbum.save()
        res.json(album)
    } catch (error) {
        res.status(500).json({message: "ERROR: couldn't save new album"})
    }
})