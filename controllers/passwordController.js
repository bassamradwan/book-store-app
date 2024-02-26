const asyncHandler = require('express-async-handler');
const {User,validateChangePassword} =require('../models/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

/**
 * @desc Forgot Password
 * @route /password/forgot-password
 * @method GET
 * @access public
 */
module.exports.getForgotPasswordView = asyncHandler((req,res)=>{
res.render('forgot-password');
});

/**
 * @desc send Forgot Password Link
 * @route /password/forgot-password
 * @method POST
 * @access public
 */
module.exports.sendForgotPasswordLink = asyncHandler(async(req,res)=>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        res.status(404).json({message: "User not found"});
    }

const secret = process.env.JWT_SECRET_KEY + user.password;
const token = jwt.sign({email:user.email,id:user.id},secret,{
    expiresIn: "10m",
})
const link = `http://localhost:5000/password/reset-password/${user.id}/${token}`;
// res.json({message:"Click on the Link ", resetPasswordLink:link});
res.send(`Click on the Link: <a href="${link}">${link}</a>`);


// TODO:Send email to the user
    });

 /**
 * @desc Get Reset Password View 
 * @route /password/reset-password/:userId/:token
 * @method GET
 * @access public
 */
module.exports.getResetPasswordView = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.userId);
    if(!user){
        res.status(404).json({message: "User not found "});
    }

const secret = process.env.JWT_SECRET_KEY + user.password;
try {
    jwt.verify(req.params.token,secret);
    res.render('reset-password',{email:user.email})
} catch (error) {
    console.log(error);
    res.json({message:"Error"})
    
}
    });

 /**
 * @desc  Reset Password
 * @route /password/reset-password/:userId/:token
 * @method POST
 * @access public
 */
module.exports.ResetPassword = asyncHandler(async(req,res)=>{
//TO DO: validateion
const {error} = validateChangePassword(req.body);
if(error){
    return res.status(400).json({message: error.details[0].message});
}
    const user = await User.findById(req.params.userId);
    if(!user){
        res.status(404).json({message: "User not found"});
    }

const secret = process.env.JWT_SECRET_KEY + user.password;
try {
    jwt.verify(req.params.token,secret);
    const salt = await bcrypt.genSalt(10);
    req.body.password = await  bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
    await user.save();
    res.render('success-password');
} catch (error) {
    console.log(error);
    res.json({message:"Error"})
    
}
    });