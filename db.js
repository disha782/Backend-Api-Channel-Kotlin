import mongoose from "mongoose"
import config from "./configuration/config.js"
export default callback => {
    mongoose.connect(config.mongoUrl, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    },).then(() => {
        console.log("Connected Succesfully")
        let db = mongoose.connection
       // db = database
        callback(db)
    })
    .catch((err) => {console.error(err)
    console.log("Not Happening")})
}