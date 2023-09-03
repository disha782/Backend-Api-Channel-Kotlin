var {expressjwt:expressjwt} = require ("express-jwt")
var express = require ("express")
const app = express()
app.use(express.json())

const SECRET_KEY = "fun chatting app"
let authenticate = expressjwt({secret : SECRET_KEY , algorithms: ['sha1', 'RS256', 'HS256']})
module.exports = authenticate