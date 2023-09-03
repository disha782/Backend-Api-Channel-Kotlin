import { Router } from "express"
import UserDataClass from "./accountFindEmail.js"
import Account from "../dbschema/accountdb.js"
// allows the code to use the functionality provided by Passport.js, such as
// authentication middleware, strategy configuration, and authentication handlers.
import passport, { Passport } from "passport"
import {generatetoken, tokenReset, isValidResetToken} from "../authToken/generatetoken.js"
import respond from "../authToken/respondtoken.js"
import { Error } from "mongoose"
import authenticate from "../authToken/authenticate.cjs"
import {resetPassLink, otp} from "../authToken/resetpassword.js"
import json from "body-parser"
    
export default({config, db}) => {
    let api = Router()
    //api.use(authenticate)

    api.post("/register", (req, res) => {
        UserDataClass.findUserByEmail(req.body.email, (err, userdata) =>{
            if(err)
            {
                res.status(409).json({
                    message : "An Error Occurred : ${err.message}"
                })
                console.log(err)
                console.log("ERROR")
            }
            else if(userdata)
            {
                res.status(300).json({
                    message:"Email is already registered"
                })
                console.log(err)
                console.log("REGISTERD")
                //console.log(userdata)
            }
            else{
                Account.register(new Account({username:req.body.email}), req.body.password,
                function(err,account){
                    if(err)
                    {
                        res.status(500).json({message:err})
                        console.log(err.mes)
                        console.log("HERE I AM")
                    }
                    else{
                        passport.authenticate('local', {session:false})(req, res, () => {
                            res.status(200).send("Success New Account Created")
                            console.log("SUCCESSFULLY CREATED")
                        })
                    }
                })
            }
        })
    })

    //Auth Login
    api.post("/login", (req, res, next) => {
        UserDataClass.findUserByEmail(req.body.email, (err, userdata) => {
            if(err){
                res.status(400).json({message : 'Error Occurred : ${err.message}'})
                console.log("Here", err)
            }
            else{
                next()
            }
        })
    }, 
    passport.authenticate("local", {session : false, scope : [],
    failWithError:true}),
    (err, req, res, next) => {
        if(err)
        {
            res.status(401).json({message : "Email or password Invalid"})
            console.log("there",err)
        }
    }, generatetoken, respond
    )


    // api.post("/forgot-password", (req, res, next) => {
    //     UserDataClass.findUserByEmail(req.body.email, (err, userdata) => {
    //         if(err){
    //             res.status(400).json({message : 'Error Occurred : ${err.message}'})
    //             console.log("Here", err)
    //         }
    //         else if(!userdata){
    //             res.status(404).json({
    //                 message : "Email Not Found"
    //             })
    //         }
    //         else{
    //             //generatetoken(req, res, () => {
    //                 generatetoken
    //                 resetPassLink(userdata.email, generatetoken.token)
    //                 res.status(200).json({
    //                     message : "Link Sent to Email"
    //                 })
    //             //})
    //         }
    //     })
    // })

    let generatedToken = ''
    api.post("/forgot-password",(req, res) => {
        try{
            UserDataClass.findUserByEmail(req.body.email, (err, userdata) => {
                if(err){
                    res.status(500).json({
                        message : "Error Occured" + err.message
                    })
                    console.log(err)
                }
                else if(!userdata){
                    res.status(404).json({
                        message : "Email Not Found"
                    })
                }
                else{
                    //generating token
                    tokenReset(userdata.email, (err, token) => {
                        if(err){
                            res.status(500).json({
                                message : "Token Generation Failed"
                            })
                            console.log(err)
                        }else{
                            resetPassLink(userdata.email, token)
                            generatedToken = token.toString()
                            res.status(200).json({
                                message : "Email Sent"
                            })
                            console.log("OTP SENT"+otp)
                        }
                    })
                }
            })
        }catch(error){

        }
    })

    api.post("/otp-verify", (req, res) => {
        try{
            if(req.body.otp == otp){
                res.status(200).json({
                    message : "Valid OTP"+ generatedToken
                })

            }else{
                res.status(500).json({
                    message : "Invalid OTP"
                })
            }
        }catch(error){
            console.log(error)
            res.status(400).json({
                message : "Error"
            })
        }
    })
    
    api.post("/update-password", (req, res) => {
        const email = req.body.email
        const newPassword = req.body.password
        console.log(email)
        console.log(req.body)

        if(!isValidResetToken(email, generatedToken)){
            res.status(400).json({
                message : "Invalid Token"
            })
            console.log("here is the problem")
            return
        }

        UserDataClass.findUserByEmail(email, (err, userdata) => {
            if(err){
                res.status(500).json({
                    message : "An Error Occured "+err.message
                })
                console.log(err)
            }
            else if(!userdata){
                res.status(404).json({
                    message : "Email Not Found"
                })
            }
            else{
                Account.findByUsername(userdata.email).
                then((account) => {
                    if(!account){
                        res.status(404).json({
                            message : "Account not found"
                        })
                        return
                    }
                    account.setPassword(newPassword, (setPassworderr) => {
                        if(setPassworderr){
                            res.status(500).json({
                                message : "Password update failed"
                            })
                            console.log(setPassworderr)
                        }else{
                            account.save().then((data) => {
                                console.log("Password Reseted")
                                res.status(200).json({
                                    message : "Password Reseted"
                                })
                            }).catch((err) => {
                                console.log(err)
                            })
                        }
                    })
                })
            }
        })
    })

    return api
}