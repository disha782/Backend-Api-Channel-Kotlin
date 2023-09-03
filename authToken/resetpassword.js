import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import {generatetoken, tokenReset} from "./generatetoken.js";

//const SECRET_KEY = generatetoken.SECRET_KEY
//console.log("fuck you")
//console.log(SECRET_KEY)

function generateOTP(){
    const otpLength = 4
    let otp = ''
    for(let i = 0; i < otpLength; i++){
        otp += Math.floor(Math.random() * 10)
    }
    return otp
}
const otp = generateOTP()

const resetPassLink = (email) => {
    const transporter = nodemailer.createTransport({
        service : "gmail",
        port : 465,
        secure : true,
        logger : true,
        debug : true,
        secureConnection : false,
        auth : {
            user : "riya6poojari@gmail.com",
            pass : "hyzuoxajiibdntkd"
        },
        tls : {
            rejectUnauthorized : true
        }
    })

    const mailOptions = {
        from : "riya6poojari@gmail.com",
        to : email,
        subject : "Reset Password",
        html :
        "<h4>OTP to Reset Password is </h4> <h1>"+otp+"</h1>"
        
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log("Error sending email : ", error)
        }
        else{
            console.log("Email sent : ", info.response)
        }
    })
}


export {resetPassLink, otp}