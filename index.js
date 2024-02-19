const express = require('express');
const { norFound, errorHandler } = require('./middlewares/errors');
require('dotenv').config();
const ConnectToDatabase = require('./config/db');

// connection to Database
ConnectToDatabase()

// Init express
const app = express();
// Apply Middlewares
app.use(express.json());


// Routes
app.use('/api/books',  require('./routes/books'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/users', require('./routes/users'));


// Error Handlers Middlewares
app.use(norFound);
app.use(errorHandler);

//runing the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running in ${process.env.MODE_ENV} mode http://localhost:5000`));
