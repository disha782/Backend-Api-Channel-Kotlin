import User from "../dbschema/userdb.js"
import authenticate from "../authToken/authenticate.cjs"
//The Router class from Express is used to create modular and mountable 
//route handlers. It provides a way to define routes in separate files 
//or modules and then use them as middleware in the main Express application.
import { Router } from 'express'

export default({config, db}) => {
    let api = Router()

    //Auth Register User
    api.post("/addUser", authenticate, (req, res) => {

        try{
            const {uname, email, userAvatar, userAvatarColor} = req.body
            const data = new User({
                uname, email, userAvatar, userAvatarColor
            })
    
            // let newUser = new User()
            // newUser.uname = req.body.uname
            // newUser.email = req.body.email
            // newUser.userAvatar = req.body.userAvatar
            // newUser.userAvatarColor = req.body.userAvatarColor
            data.save()
            //res.send("User Successful")
            res.status(200).json(data)
            console.log("Succefull Sign")
            //console.log(val)
        }
        catch(err){
            console.log(err)
        }
    })

    api.get("/byEmail/:email", (req, res) => {
        //console.log("going in")
        User.findOne({"email" : req.params.email})
        .then((output) =>
        {
            res.status(200).json(output)
        }).catch((err) =>{
            res.status(500).json({message : err})
            console.log(err)
        })

    })

    api.get("/statusUser", (req, res) => {
        const status = {
            "Status" : "Running"
        }
        res.send(status)
    })


    return api
}