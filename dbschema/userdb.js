import mongoose from "mongoose"
const { Schema } = mongoose
const User = new Schema({
    uname : String, 
    email : String, 
    userAvatar : String, 
    userAvatarColor : String
})

//module.exports = mongoose.model('User', User)
export default mongoose.model("User", User)