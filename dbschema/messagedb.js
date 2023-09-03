import mongoose from "mongoose"
import Channel from './channeldb.js'
import User from "./userdb.js"
const { Schema } = mongoose
const ObjectId = mongoose.Schema.Types.ObjectId
const Message = new Schema({
    // message : {
    //     content : {
    //         type : String
    //     },
    //     type : {
    //         type : String,
    //         enum : ["text", "image"]
    //     },
    //     image : {
    //         type : String
    //     }
    // },
    message : {type:mongoose.Schema.Types.Mixed},
    messagetype : String,
    userId : {type : ObjectId, ref : 'User'},
    channelId : {type : ObjectId, ref : 'Channel'},
    userName : String , 
    userAvatar : String, 
    userAvatarColor : String,
    timestamp : {type : Date, default : Date.now}

})
export default mongoose.model("Message", Message)