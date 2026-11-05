const asyncHandler = require('express-async-handler');
const {User,validateChangePassword} =require('../models/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

// The same answer whether the email exists or not,
// so nobody can use this form to find out who has an account.
const FORGOT_PASSWORD_MESSAGE = "If this email is registered, a password reset link has been sent to it.";

/**
 * Sends the reset link to the user's email.
 * Without SMTP_HOST (local development) the link is printed in the server console instead.
 * The link is never sent back in the HTTP response: whoever asks for a reset
 * is not necessarily the owner of the email.
 */
async function sendResetLink(email, link) {
    if (!process.env.SMTP_HOST) {
        console.log(`[dev] Password reset link for ${email}: ${link}`);
        return;
    }
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Reset your password",
        html: `<p>Click the link below to reset your password. It expires in 10 minutes.</p><p><a href="${link}">${link}</a></p>`,
    });
}

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
    // Only a plain string: an object like {"$ne": null} would match the first user in the database.
    if (typeof req.body.email !== "string") {
        return res.status(200).json({message: FORGOT_PASSWORD_MESSAGE});
    }
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(200).json({message: FORGOT_PASSWORD_MESSAGE});
    }

    // The secret includes the current password hash, so the link stops working
    // as soon as the password changes: it can only be used once.
    const secret = process.env.JWT_SECRET_KEY + user.password;
    const token = jwt.sign({email:user.email,id:user.id},secret,{
        expiresIn: "10m",
    })
    const appUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}`;
    const link = `${appUrl}/password/reset-password/${user.id}/${token}`;

    await sendResetLink(user.email, link);
    res.status(200).json({message: FORGOT_PASSWORD_MESSAGE});
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
        return res.status(404).json({message: "User not found"});
    }

const secret = process.env.JWT_SECRET_KEY + user.password;
try {
    jwt.verify(req.params.token,secret);
    res.render('reset-password',{email:user.email})
} catch (error) {
    res.status(400).json({message:"Invalid or expired link"})
}
    });

 /**
 * @desc  Reset Password
 * @route /password/reset-password/:userId/:token
 * @method POST
 * @access public
 */
module.exports.ResetPassword = asyncHandler(async(req,res)=>{
const {error} = validateChangePassword(req.body);
if(error){
    return res.status(400).json({message: error.details[0].message});
}
    const user = await User.findById(req.params.userId);
    if(!user){
        return res.status(404).json({message: "User not found"});
    }

const secret = process.env.JWT_SECRET_KEY + user.password;
try {
    jwt.verify(req.params.token,secret);
} catch (error) {
    return res.status(400).json({message:"Invalid or expired link"})
}
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();
    res.render('success-password');
    });
