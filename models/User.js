const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity")
const jwt= require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true,
    },
    userName:{
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    isAdmin:{
        type:Boolean,
        default: false,
    },
},{timestamps:true});

// Generate Token
UserSchema.methods.generateToken = function(){
return jwt.sign({id:this._id,isAdmin:this.isAdmin},process.env.JWT_SECRET_KEY);
};

// User Model
const User = mongoose.model('User', UserSchema);

// Validate Registered Users
function validateRegisterUser(obj) {
const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email().required(),
    userName: Joi.string().trim().min(2).max(200).required(),
    password: passwordComplexity().required()
});
return schema.validate(obj);
};

// Validate Login Users
function validateLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).email().required(),
        password: Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);
    };

    // Validate Update Users
function validateUpdateUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).email(),
        userName: Joi.string().trim().min(2).max(200),
        password: Joi.string().trim().min(6),
    });
    return schema.validate(obj);
    };

    // Validate change password
function validateChangePassword(obj) {
    const schema = Joi.object({
        password: Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);
    };
module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser,
    validateChangePassword
};