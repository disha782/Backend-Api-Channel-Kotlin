//FILE WHICH ROUTES ALL FUNCTIONS
import express from "express";
//we are importing the file
import indexing from "../authToken/index.js"
import user from "../controller/user.js"
import acc from "../controller/account.js"
import config from "../configuration/config.js"
import database from "../db.js";
import channel from "../controller/channel.js";
import message from "../controller/message.js";

let router = express()

//connect to db
database(db => {
    router.use(indexing({config, db}))

    router.use("/user", user({config, db}))
    router.use("/account", acc({config, db}))
    router.use("/channel", channel({config, db}))
    router.use("/message", message({config, db}))

})
export default router