import mongoose from "mongoose"
const { Schema } = mongoose
const Channel = new Schema({
    name : String, 
    description : String
})
export default mongoose.model("Channel", Channel)
