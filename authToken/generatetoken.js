import expressjwt from "express-jwt"
import jwt from "jsonwebtoken"
import express from "express"
const app = express()
app.use(express.json())

const TOKENTIME = 60*60*24*90
const SECRET_KEY = "fun chatting app"

const tokenReset = (email, callback) => {
    const payload = {
        email : email
    }
    const options = {
        expiresIn : '1h'
    }
    jwt.sign(payload, SECRET_KEY, options, (err, token) => {
        if(err){
            callback(err, null)
        }else{
            callback(null, token)
        }
    })
}

let generatetoken = (req, res, next) => {
    req.token = req.token || {}
    req.token = jwt.sign({
        id : req.user.id},
        SECRET_KEY, {
            expiresIn : TOKENTIME
        })
        next()
    }

    const isValidResetToken = (email, token) => {
        
        try{
            const decodedToken = jwt.verify(token, SECRET_KEY)
            console.log(decodedToken.email)
            console.log(email)
            console.log("IN try block")
            if(decodedToken.email == email){
                console.log("IF SUCCESS")
                return true
            }
            else{
                console.log("ELSE PART")
                return false
            }
        }catch(err){
            console.log(token)
            console.log(err)
            console.log("IN CATCH BLOCK")
            return false
        }
    }


export {generatetoken, tokenReset, isValidResetToken}