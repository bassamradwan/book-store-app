const mongoose = require('mongoose');
const Joi = require('joi');


const AuthorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [3, "First name must be at least 3 characters long"],
        maxlength: [300, "First name must be at least 200 characters long"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [3, "Last namemust be at least 3 characters long"],
        maxlength: [300, "Last name must be at least 200 characters long"]
    },
    nationality: {
        type: String,
        required: [true, "nationality is required"],
        trim: true,
        minlength: [3, "nationality must be at least 3 characters long"],
        maxlength: [100, "nationality must be at least 500 characters long"]
    },
    image: {
        type: String,
        default: "image-default.png",
    }
}, {
    timestamps: true
});


const Author = mongoose.model("Author", AuthorSchema)

// Validate Create a new authors
function validateCreateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(300).required(),
        lastName: Joi.string().trim().min(3).max(300).required(),
        nationality: Joi.string().trim().min(3).max(100).required(),
        image: Joi.string()
    });
    return schema.validate(obj)

};

// Validate Update a authors
function validateUpdateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(300).required(),
        lastName: Joi.string().trim().min(3).max(300).required(),
        nationality: Joi.string().trim().min(3).max(100).required(),
        image: Joi.string()
    });
    return schema.validate(obj);

};

module.exports = {
    Author,
    validateCreateAuthor,
    validateUpdateAuthor
};