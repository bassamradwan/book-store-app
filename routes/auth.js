const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const {
    validateLoginUser,
    validateRegisterUser,
    User
} = require('../models/User')

/**
 * @desc Register New User
 * @route /api/auth/register
 * @method POST
 * @access public
 */

router.post('/register', asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email }); 
    if (user){
        return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  user= new User({
      email: req.body.email,
      userName:req.body.userName,
      password: req.body.password,
  }); 
    const result = await user.save();
    const token = user.generateToken();
    
    const {password,...other} = result._doc;
    res.status(201).json({...other,token}); //201 => created successfully
}));

/**
 * @desc Login User
 * @route /api/auth/Login
 * @method POST
 * @access public
 */

router.post('/login', asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message ,message:'here'});
    }
    let user = await User.findOne({ email: req.body.email }); 
    if (!user){
        return res.status(400).json({ message: 'invalid Email or Password' });
    }
    
const isPassword = await bcrypt.compare(req.body.password,user.password);
if(!isPassword){
return res.status(400).json({ message: 'invalid Email or Password'});
}
    const token = user.generateToken();
    const {password,...other} = user._doc;
    res.status(200).json({...other,token}); //201 => created successfully
}));

module.exports = router;