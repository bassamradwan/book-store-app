const mongoose = require('mongoose');

async function ConnectToDatabase() {
    // connection to Database
    try {
       await mongoose.connect("mongodb+srv://bassammohmedali:7RXYaoOY5Pl0DYpb@books-store.rzxa36m.mongodb.net/my-book-store?retryWrites=true&w=majority")
        console.log('Connected to MongoDB...');
    } catch (error) {
        console.error('Could not connect to MongoDB...', error)
    }
    //ather connect and  old connection 
    // mongoose
    // .connect(process.env.MONGO_URI)
    // .then(() => console.log('Connected to MongoDB...'))
    // .catch(err => console.error('Could not connect to MongoDB...', err));
}

module.exports = ConnectToDatabase;