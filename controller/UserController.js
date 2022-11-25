const User = require('../Model/UserModel')
const Token = require('../Model/TokenModel')
const crypto = require('crypto')
const { sendEmail } = require('../utils/sendEmail')
const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')

// create new user
exports.register = async(req,res) => {
    let user = await User.findOne({
        email: req.body.email
    })
    if(user){
       return res.status(400).json({error:"User already exists."})
    }
    let userToAdd = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    // generate token
    let token = new Token({
        token:crypto.randomBytes(24).toString('hex'),
        user: userToAdd._id
    })
    token = await token.save()
    if(!token){
        return res.status(400).json({error: "Failed to generate token. Please try again later."})
    }
    // send in email
    const url = `${process.env.server_url}/emailconfirmation/${token.token}`
    sendEmail({
        from: "noreply@ourstore.com",
        to: req.body.email,
        subject: "Verification Email",
        text: "Click on the following link to verify your email."+url,
        html: `<a href='${url}'><button>Verify email</button></a>`
    })

    userToAdd = await userToAdd.save()
    if(!userToAdd){
        return res.status(400).json({error:"Failed to register"})
    }
    else{
        res.send(userToAdd)
    }
}

// resend confirmation
exports.resendconfirmation = async(req, res) => {
    // find user
    let user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({error:"User not found. Please register."})
    }
    // check if already verified
    if(user.verified){
        return res.status(400).json({error: "User already verified. Login to continue"})
    }

    // generate token
    let token = new Token({
        token:crypto.randomBytes(24).toString('hex'),
        user: user._id
    })
    token = await token.save()
    if(!token){
        return res.status(400).json({error: "Failed to generate token. Please try again later."})
    }
    // if not verified, send confirmation email
    const url = `${process.env.server_url}/emailconfirmation/${token.token}`
    sendEmail({
        from: "noreply@ourstore.com",
        to: req.body.email,
        subject: "Resend Verification Email",
        text: "Click on the following link to verify your email."+url,
        html: `<a href='${url}'><button>Verify email</button></a>`
    })

    return res.status(200).json({message:"Verification Link has been sent to your email."})
}





exports.verifyEmail = async(req,res) => {
    let token = await Token.findOne({token: req.params.token})
    if(!token){
        return res.status(400).json({error:"Invalid or Token may have expired."})
    }
    let user = await User.findOne({
        _id: token.user
    })
    if(!user){
        return res.status(400).json({error:"User not found."})
    }
    if(user.verified){
        return res.status(400).json({error: "User already verified. Login to continue."})
    }
    user.verified = true
    user = await user.save()
    if(!user){
        return res.status(400).json({error: "Failed to verify email."})
    }
    return res.status(200).json({message: "user email verified successfully."})
}




exports.userList = async(req,res) => {
    let users = await User.find()
    if(!users){
        return res.status(400).json({error: "Something went wrong"})
    }
    res.send(users)
}

// search user by email
exports.searchUserByEmail = async(req, res) => {
    let user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).json({error: "Something went wrong"})
    }
    res.send(user)
}

// find user by id
exports.findUser = async(req,res) => {
    let user = await User.findById(req.params.id)
    // let user = await User.findOne({_id: req.params.id})
    if(!user){
        return res.status(400).json({error: "Something went wrong"})
    }
    res.send(user)
}

// signin preocess
exports.signin = async(req,res) => {
    const {email,password} = req.body
    // check if email exists
    let user = await User.findOne({email:email})
    if(!user){
        return res.status(400).json({error: "Email not registered."})
    }
    // check if password is correct
    if(!user.authenticate(password)){
        return res.status(400).json({error:"Email and password does not match."})
    }
    // check if verified or not
    if(!user.verified){
        return res.status(400).json({error:`User not verified, verify to continue <a href='${process.env.server_url}/resendverification'>Resend Verification</a>`})
        // return res.send({error:"verification error"})
    }

    // generate login token and save it in cookie
const token = jwt.sign({_id: user._id, role: user.role},process.env.jwt_secret)
res.cookie('myCookie',token, {expires: new Date(Date.now()+86400)})

const {_id, username, role} = user
res.json({token, user : {_id, username, role, email}})
}

// for authorization
exports.requiresignin = expressjwt({
    secret:process.env.jwt_secret,
    algorithms:["HS256"]
})

// forget password
exports.forgetPassword = async(req, res) => {
    // check email
    let user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).json({error: "Email not registered."})
    }
    // generate token  
    let token = new Token({
        user: user._id,
        token: crypto.randomBytes(24).toString('hex')
    })
    token = await token.save()
    if(!token){
        return res.status(400).json({error:"Something went wrong"})
    }
    // send token in email
    const url = `${process.env.server_url}/resetpassword/${token.token}`
    sendEmail({
        from: "noreply@example.com",
        to: user.email,
        subject: "Reset Password",
        text: `Click on the following link to reset your password ${url}`,
        html: `<a href='${url}'><button>Reset Password</button></a>`
    })
        res.status(200).json({message:"Password reset link has been sent to your email."})
    
}

// resetpassword
exports.resetPassword = async(req,res) => {
    let token = await Token.findOne({token: req.params.token})
    if(!token){
        return res.status(400).json({error:"Invalid token or token may have expired."})
    }
    // let user = await User.findOne({_id: token.user})
    
    let user = await User.findById(token.user)
    if(!user){
        return res.status(400).json({error:"User not found."})
    }
    user.password = req.body.password
    user = await user.save()
    if(!user){
        return res.status(400).json({error:"Something went wrong"})
    }
    return res.status(200).json({message:"Password reset successful."})
    
} 

// signout
exports.signout = async (req, res) => {
    res.clearCookie('myCookie')
    return res.status(400).json({message:"Signed out successfully"})
}