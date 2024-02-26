const asyncHandler = require('express-async-handler');
const { validateCreateBook, validateUpdateBook, Book } = require('../models/Book')


/**
 * @desc Get all books
 * @route /api/books
 * @method GET
 * @access public
 */
const getAllBooks = asyncHandler(
    async (req, res) => {
        const { minPrice, maxPrice } = req.query;
        let books;
        if (minPrice && maxPrice) {
            books = await Book.find({ price: { $gte: minPrice, $lte: maxPrice } }).populate("author", ["_id", "fristName", "lastName"]);
        } else {
            books = await Book.find().populate("author", ["_id", "fristName", "lastName"]);
        }
        res.status(200).json(books);
    }
)

/**
 * @desc Get books by ID
 * @route /api/books/:id
 * @method GET
 * @access public
 */
const getBookById =  asyncHandler(
    async (req, res) => {
        const book = await Book.findById(req.params.id).populate("author");
        if (book) {
            res.status(200).json(book);
        }
        else {
            res.status(404).json({ message: 'Book not found' });
        }
    }
)

/**
 * @desc Create a new book
 * @route /api/books
 * @method POST
 * @access private (only admin)
 */
const createBook =  asyncHandler(
    async (req, res) => {
        console.log(req.body);

        const { error } = validateCreateBook(req.body); //validateCreateBook => validateCreateBook.js
        if (error) {
            return res.status(400).json({ message: error.details[0].message }); //400 => bad request
        }


        const book = new Book(
            {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                price: req.body.price,
                cover: req.body.cover
            }
        )
        const result = await book.save()
        res.status(201).json(result); //201 => created successfully
    }
)

/**
 * @desc Update a book
 * @route /api/books/:id
 * @method PUT
 * @access private (only admin)
 */
const updateBook =  asyncHandler(
    async (req, res) => {
        const { error } = validateUpdateBook(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                price: req.body.price,
                cover: req.body.cover
            }
        }, { new: true })
        res.status(200).json(updatedBook); //200 => Update successfully
    }
)

/**
 * @desc Delet a book
 * @route /api/books/:id
 * @method DELET
 * @access private (only admin)
 */
const deleteBook =  asyncHandler(
    async (req, res) => {
        const book = await Book.findById(req.params.id);
        if (book) {
            await Book.findByIdAndDelete(req.params.id,)
            res.status(200).json({ message: 'book has been delet' });
        } else {
            res.status(404).json({ message: 'book not found' });

        }

    }
)

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};