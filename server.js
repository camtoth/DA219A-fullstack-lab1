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
        const album = await Album.find({title: req.body.title, artist:req.body.artist})
        if (album?.length > 0){
            res.status(409).json({message: "ERROR: album already exists"})
        } else {
            const createdAlbum = await newAlbum.save()
            res.status(201).json(createdAlbum)
            }
    } catch (error) {
        res.status(500).json({message: "ERROR: couldn't save new album"})
    }
})

app.delete('/albums/:id', async(req,res)=> {
    try {
        const albumToDelete = await Album.findOne({_id: req.params.id})
        if (albumToDelete){
            result = await Album.deleteOne({_id: albumToDelete._id})
            res.status(201).json("Album deleted!")
        }
        else 
            res.status(404).json({message: "ERROR: couldn't find album with this id"})
    } catch (error) {
        res.status(500).json({message: "ERROR: couldn't delete album"})
    }
})

app.put('/albums/:id', async(req,res)=>{
    const newTitle = req.body.newTitle
    const newArtist = req.body.newArtist
    const newYear = req.body.newYear
    

    if (!newTitle || !newArtist || !newYear){
        res.status(400).json({message: "ERROR: please specify album title, artist and year"})
    }

    try {
        const albumToUpdate = await Album.findOne({_id: req.params.id})
        console.log(albumToUpdate)
        if (!albumToUpdate){
            res.status(404).json({message: "ERROR: album not found"})
        } else {
            albumToUpdate.title = newTitle
            albumToUpdate.artist = newArtist
            albumToUpdate.year = newYear
            await albumToUpdate.save()
            res.status(201).json("Album updates successfully!")
        }
    } catch (error) {
        //res.status(500).json({message: "ERROR: couldn't update album"})
    }
})