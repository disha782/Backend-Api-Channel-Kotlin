import express, { response } from "express"
import config from "./configuration/config.js"
import router from "./routes/index.js"
import passport from "passport"
import bodyParser from 'body-parser';
import LocalStrategy from 'passport-local'
import MessageSchema from "./dbschema/messagedb.js"
import ChannelSchema from "./dbschema/channeldb.js"
import io from "socket.io";
import {createServer} from "http"

import mongoose from "mongoose"
let app = express()
app.use(express.json())
const server = createServer(app)
app.use(passport.initialize())


// mongoose.connect(config.mongoUrl, {
//     useNewUrlParser : true,
//     useUnifiedTopology : true,
// },).then(() => {
//     console.log("Connected Succesfully")
// })
// .catch((err) => {console.error(err)
// console.log("Not Happening")})

app.use(bodyParser.urlencoded({extended:true}))

import account from "./dbschema/accountdb.js"
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField : 'password'
}, account.authenticate()
))

//passport.use(account.createStrategy())
passport.serializeUser(account.serializeUser())
passport.deserializeUser(account.deserializeUser())

app.use("/v1", router)

app.get("/", (req, res) => {
    res.json({message : "API is Alive"})
})

app.get("/status", (req, res) => {
    const status = {
        "Status" : "Running"
    }
    res.send(status)
})

app.use(bodyParser.json({
    limit: config.bodyLimit
  }));

//*****************SOCKETS*********************
var typingUsers = {}


const conn = io(server, {cors: {
    origin: "*",
    methods : ["GET", "POST"]}})

//console.log("near socket")
conn.on("connection", (socket) => {
    try{
        console.log("A user is Connected")
    //Created New Channel
        socket.on("newChannel", function(name, description){
            let newChannel = new ChannelSchema({
                name : name,
                description : description
            })
            newChannel.save().then((data) => {
                console.log("New Channel Created")
                io.emit("channelCreated", data.name, data.description, data.id)
            }).catch((error) => {
                console.log(error)
            })
        })

    //Started Typing
        socket.on("startType", function(username, channelId){
            console.log("User" + username + " is Writing a Message...")
            typingUsers[username] = channelId
            io.emit("userTypingUpdate", typingUsers, channelId)
        })

    //Stopped Typing
        socket.on("stopTyping", function(userName){
            console.log("User " + userName + " has Stopped Typing")
            delete typingUsers[userName]
            io.emit("userTypingUpdate", typingUsers)
        })

    //New Chat Message
        socket.on("newMessage", function( message, userId, channelId, userName, userAvatar, userAvatarColor){
            const messageData = JSON.parse(message)
            let newMessage = new MessageSchema({
                message : messageData.content,
                messagetype : messageData.type,
                userId : userId, 
                channelId : channelId, 
                userName : userName, 
                userAvatar : userAvatar, 
                userAvatarColor : userAvatarColor,
        
            })
           // console.log(messageData.content)
            newMessage.save().then((msg) =>{
               // console.log(messageData.content)
                socket.emit("messageCreated", msg.message, msg.type, msg.userId, 
                msg.channelId, 
                msg.userName, 
                msg.userAvatar, 
                msg.userAvatarColor, msg.id, msg.timestamp)
             //   console.log(messageData.content)
              //  console.log(newMessage)
                console.log("New Message Sent")
            }).catch((error) => {
                console.log(error)
            })
        })

    //New Image Message
        // socket.on("newMessageImage", function( userId, channelId, userName, userAvatar, 
        //     userAvatarColor, image ){
        //     //console.log(message)
        //     console.log("reaching here")
        //     const imageBuffer = Buffer.from(image, "base64")
        //     let newMessage = new MessageSchema({
        //         message : {
        //             type: "image",
        //             content : image.imageBase64
        //         },
        //         userId : userId, 
        //         channelId : channelId, 
        //         userName : userName, 
        //         userAvatar : userAvatar, 
        //         userAvatarColor : userAvatarColor, 
        //     })
        //     newMessage.save().then((msg) =>{
        //         socket.emit("messageCreatedImage", msg.message , msg.userId, 
        //         msg.channelId, 
        //         msg.userName ,
        //         msg.userAvatar, 
        //         msg.userAvatarColor,msg.image ,msg.id ,msg.timestamp)
        //         console.log("New Message Sent")
        //     }).catch((error) => {
        //         console.log(error)
        //     })
        // })
    }
    catch(error){
        console.error("Error creating new channel:", error)
    }
})



//server.listen(3000)

//Port
server.listen(config.port, () => { 
    console.log("Started on port", config.port)
})
export default app