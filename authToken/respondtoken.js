import expressjwt from "express-jwt"
import jwt from "jsonwebtoken"
import express from "express"
const app = express()
app.use(express.json())

let respond = (req, res) => {
    res.status(200).json({
        user : req.user.username,
        token : req.token
    })
}
export default respond