const { Book } = require('./models/Book')
const {Author} = require('./models/Authors')
const { books , authors} = require('./data')
const connectToDb = require("./config/db")
require('dotenv').config()

// Connection to DB
connectToDb()

// Import books
const importBooks = async () => {
    try {
        await Book.insertMany(books)
        console.log("book Imported");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

// Import author
const importAuthors = async () => {
    try {
        await Author.insertMany(authors)
        console.log("authors Imported");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

// Remove books
const removeBooks = async () => {
    try {
        await Book.deleteMany();
        console.log("book removed");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if(process.argv[2]=== "-import"){
    importBooks()
} else if(process.argv[2]=== "-remove"){
    removeBooks()
}else if(process.argv[2]=== "-import-author"){
    importAuthors()
}

