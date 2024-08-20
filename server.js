 



const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 3000;

// Middleware
app.use(cors({
 origin:`https://registration-f40k.onrender.com/`,
 methods:[`GET`,`POST`]
}));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// // MongoDB connection
// const MongoDB_URI = ' mongodb+srv://sssaini427:eUcyhWUTvdZwDjY0@saurabh.j5d6osx.mongodb.net/mydata';
// mongoose.connect(MongoDB_URI, { //useNewUrlParser: true, useUnifiedTopology: true
//      })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('MongoDB connection error:', err));

//     const mongoose = require('mongoose');
// require('dotenv').config(); // Only necessary for local development with a .env file

const uri = process.env.MONGODB_URI; // Fetch the MongoDB URI from environment variables

if (!uri) {
    console.error("MongoDB connection string is not defined. Please set MONGODB_URI environment variable.");
    process.exit(1); // Terminate the process if the URI is not defined
}

mongoose.connect(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
});

// Mongoose Schema with custom error messages
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'First name is required'], match: [/^[a-zA-Z]+$/, 'First name must contain only letters'] },
    lastName: { type: String, required: [true, 'Last name is required'], match: [/^[a-zA-Z]+$/, 'Last name must contain only letters'] },
    mobileNo: { type: String, required: [true, 'Mobile number is required'], match: [/^\d{10}$/, 'Mobile number must be a 10-digit number'] },
    emailId: { type: String, required: [true, 'Email ID is required'], match: [/^\S+@\S+\.\S+$/, 'Email ID must be a valid email address'] },
    address: { type: String, match: [/^[a-zA-Z\s]*$/, 'Address must contain only letters and spaces'] },
    street: { type: String, match: [/^[a-zA-Z\s]*$/, 'Street must contain only letters and spaces'] },
    city: { type: String, match: [/^[a-zA-Z\s]*$/, 'City must contain only letters and spaces'] },
    state: { type: String, match: [/^[a-zA-Z\s]*$/, 'State must contain only letters and spaces'] },
    country: { type: String, match: [/^[a-zA-Z\s]*$/, 'Country must contain only letters and spaces'] },
    loginId: { type: String, required: [true, 'Login ID is required'], match: [/^[a-zA-Z0-9]{6,10}$/, 'Login ID must be at least 8 characters long and contain only letters and numbers'] },
    password: { type: String, required: [true, 'Password is required'], match:[/^[a-zA-Z0-9]{8,12}$/ , 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number'] },
    creationTime: { type: Date, default: Date.now },
    lastUpdatedOn: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/api/user', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        console.error('Error saving user:', err);
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            res.status(400).send({ message: 'Validation error', errors });
        } else {
            res.status(400).send({ message: 'Error saving user', error: err.message });
        }
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        console.error('Error loading users:', err);
        res.status(400).send({ message: 'Error loading users', error: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
