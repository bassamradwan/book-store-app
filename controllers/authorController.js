const express = require('express');
const asyncHandler = require('express-async-handler');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const router = express.Router();
const { Author, validateCreateAuthor, validateUpdateAuthor } = require('../models/Authors');


/**
 * @desc get all authors
 * @route /api/authors
 * @method GET
 * @access public
 */
const getAllAuthors= asyncHandler(
    async (req, res) => {
        const {pageNumber}=req.query;
        const authorsPerPage=2;
        const authorsList = await Author.find()
        .skip((pageNumber -1)*authorsPerPage)
        .limit(authorsPerPage);
        res.status(200).json(authorsList);
    }
);

/**
 * @desc get authors By id
 * @route /api/authors/:id
 * @method GET
 * @access public
 */
const getAuthorById= asyncHandler(
    async (req, res) => {
        const author = await Author.findById(req.params.id);
        if (author) {
            res.status(200).json(author);
        } else {
            res.status(404).json({ message: 'Author not found' });
        }
    }
);

/**
 * @desc Create a new authors
 * @route /api/authors
 * @method POST
 * @access private  (only admin)
 */
const createAuthor = asyncHandler(
    async (req, res) => {
        console.log(req.body);
        const { error } = validateCreateAuthor(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const author = new Author({
            fristName: req.body.fristName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            image: req.body.image
        });
        const result = await author.save();
        res.status(201).json(result); //201 => created successfully
    }
);

/**
 * @desc Update a authors
 * @route /api/authors/:id
 * @method PUT
 * @access private  (only admin)
 */
const updateAuthor= asyncHandler(
    async (req, res) => {
        const { error } = validateUpdateAuthor(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const author = await Author.findByIdAndUpdate(req.params.id, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                nationality: req.body.nationality,
                image: req.body.image
            }
        }, { new: true });
        res.status(200).json(author); //201 => Update successfully
    }
);

/**
 * @desc Delet a authors
 * @route /api/authors/:id
 * @method DELET
 * @access private  (only admin)
 */
const deleteAuthor= asyncHandler(
    async (req, res) => {
        const author = await Author.findById(req.params.id);
        if (author) {
            await Author.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Author deleted successfully' });
        } else {
            res.status(404).json({ message: "Author not found" });
        }
    }
);



module.exports = {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
 
};