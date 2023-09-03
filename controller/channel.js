import { Router } from "express";
import authenticate from "../authToken/authenticate.cjs";
import ChannelSchema from "../dbschema/channeldb.js";
//import Channel from "../dbschema/channeldb.js";

export default({config, db}) =>{
    let api = Router()

    //add channels
    api.post("/add", authenticate, (req, res) => {
        let newChannel = new ChannelSchema()
        newChannel.name = req.body.name
        newChannel.description = req.body.description
        newChannel.save().then(() =>{
            res.status(200).json({message : "Channel Saved Successfully"})
        }).catch((error) => {
            res.status(500).json({message : error})
        })
    })

    //display all channels
    api.get("/get", authenticate, (req, res) => {
        ChannelSchema.find({}).then((data) => {
            res.status(200).json(data)
        }).catch((error) => {
            res.status(500).json({message : error})
        })
    })
    
    

    
    return api
}