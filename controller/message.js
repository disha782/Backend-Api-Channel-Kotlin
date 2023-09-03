import { Router } from "express"
import authenticate from "../authToken/authenticate.cjs";
import MessageSchema from "../dbschema/messagedb.js";
import multer from "multer";
import path from 'path'
import fs from 'fs'
import config from "../configuration/config.js";
import express from "express"
import msgdatatypedb from "../dbschema/msgdatatypedb.js";
import { GridFsStorage } from "multer-gridfs-storage";

export default({config, db}) => {
    let api = Router()
    const directory = "uploads"
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory)
    }
    // api.use(express.static('uploads'))

    // var storage = multer.diskStorage({
    //     destination : function(req, file, cb) {
    //         cb(null, 'uploads')
    //     },
    //     filename : function(req, file, cb){
    //         cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    //     }
    // })

    // var uploads = multer({storage : storage})
    // //Upload Single File
    // api.post("/uploadFile", authenticate, uploads.single('myFile'), 
    // (req, res, next) => {
    //     const file = req.file
    //     if(!file){
    //         const error = new Error("Please upload file")
    //         console.log(error)
    //         res.json({message : error})
    //         return next({code : 500, message : error})
    //     }
    //     res.send({code : 200, message : file})
    //     res.json({message : "File Sent"})
    // })

    const storage = multer.diskStorage({
        destination : (req, file, cb) => cb(null, directory),
        filename: (req, file, cb) => {
            const name = `${Date.now()}-${Math.round(
                Math.random()*1e9
            )}${path.extname(file.originalname)}`
            cb(null, name)
        }
    })

    const upload = multer({
        storage : storage,
        limits: {fileSize: 1000000 * 5}
    }).single('image')


    //upload image through postman
    api.post("/upload", authenticate, (req, res) => {
        upload(req, res, (err) => {
            if(err){
                console.log(err)
            }
            else{
                let newMessage = new MessageSchema({
                message : {body: req.body,
                file: req.file},
                userId : req.body.userId,
                channelId : req.body.channelId,
                userName : req.body.userName,
                userAvatar : req.body.userAvatar,
                timestamp : req.body.timestamp})

                newMessage.save().then(() => {
                    res.status(200)
                    res.json({message : " Message Sent"})
                    console.log("Message Sent")
                }).catch((error) => {
                    res.status(500).json({message : error})
                    console.log(error)
                })
            }
        })
    })

    api.post("/sendmsg", authenticate, upload,
        async (req, res) => {
            try{
                let newMessage = new MessageSchema()
                if(req.file){
                    const bitmap = req.file.filename
                    const imageData = new msgdatatypedb({
                        type : "image",
                        image : bitmap
                    })
                    newMessage.message = imageData


                    // const bitmap = req.file
                    // newMessage.message = bitmap
                    // newMessage.messagetype = "image"


                }else{
                    // const textData = new msgdatatypedb({
                    //     type : "text",
                    //     content : req.body.message
                    // })
                    // newMessage.message = textData
                    newMessage.message = req.body.message
                    newMessage.messagetype = "text"
                }

                newMessage.userId = req.body.userId
                newMessage.channelId = req.body.channelId
                newMessage.userName = req.body.userName
                newMessage.userAvatar = req.body.userAvatar
                newMessage.timestamp = req.body.timestamp
    
                await newMessage.save()
                res.status(200).json({message : "Message Sent"})
                console.log("Message Sent")
            }catch(error){
                res.status(500).json({message : error})
                console.log(error)
            }
        }
    )

    //update
    api.post("/update/:id", authenticate, (req, res) => {
        MessageSchema.findById(req.params.userId, (error, message) => {
            if(error){
                res.status(500).json({message : error})
                console.log("UPDATE ERROR", error)
            }
            message.message = req.body.message
            message.userId = req.body.userId
            message.channelId = req.body.channelId
            message.userName = req.body.userName
            message.userAvatar = req.body.userAvatar
            message.timestamp = req.body.timestamp
            message.save().then(() => {
                console.log(popo)
                res.status(200).json({message : "Message Updated"})
            }).catch((error) => {
                res.status(500).json({message : error})
                console.log("vghg")
                console.log(error)
            })
        })
    })

    //delete particular message
    api.delete("/delete/:_id", authenticate, (req, res) => {
        MessageSchema.findByIdAndDelete({"_id" : req.params._id})
        .then(() => {
            res.json({message : "Deletion Successful"})
            console.log("Successfully deleted message")
        }).catch((error) => {
            res.json({message : error})
            console.log("Message Not Found", error)
        })
    })
    
    //load messages from channel
    api.get("/channel/:channelId", authenticate, (req, res) => {
        MessageSchema.find({"channelId" : req.params.channelId}).then((data) => {
          //  res.sendStatus(200)
            res.json(data)
            console.log("Successfully Loaded Messages")
        }).catch((error) => {
           // res.sendStatus(500)
            res.json({message : error})
            console.log("NOT FOUND CHANNEL", error)
        })
    })

    return api
}