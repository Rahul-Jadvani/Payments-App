const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Database is connected..")
    } catch (error) {
        console.log('Database connection error: ', error);
        return -1;
    }
};

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    }
});

const User = mongoose.model('User', userSchema);


const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema)





module.exports = {
    User,
    Account,
    dbConnection
}