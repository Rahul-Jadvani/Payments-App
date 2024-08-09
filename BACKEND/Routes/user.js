const express = require('express');
const zod = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Dependencies
const { User, Account } = require('../DataBase/db');
const { tokenSecret } = require('../Token/config');

// Middleware to authenticate token and extract user ID
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, tokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.userId = user.userId;
        next();
    });
};

// Sign-up route
const signupBody = zod.object({
    userName: zod.string().email(),
    firstName: zod.string().min(3),
    lastName: zod.string().min(3),
    password: zod.string().min(6)
});

router.post('/signup', async (req, res) => {
    const validation = signupBody.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid Inputs",
            error: validation.error.errors // Directly using the error array from Zod
        });
    }

    try {
        const existingUser = await User.findOne({ userName: req.body.userName });

        if (existingUser) {
            return res.status(400).json({
                message: "Username/email already exists/taken"
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const user = await User.create({
            userName: req.body.userName,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

        const userId = user._id;

        const token = jwt.sign({ userId }, tokenSecret, { expiresIn: '1h' }); // Set token expiration time

        await Account.create({
            userId,
            balance: 2 + Math.random() * 10000
        });

        res.status(200).json({
            message: "User created successfully",
            token
        });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Sign-in route
const signinBody = zod.object({
    userName: zod.string().email(),
    password: zod.string().min(6)
});

router.post('/signin', async (req, res) => {
    const validation = signinBody.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid Inputs",
            error: validation.error.errors
        });
    }

    try {
        const userExists = await User.findOne({ userName: req.body.userName });
        if (!userExists) {
            return res.status(400).json({
                message: "Invalid username"
            });
        }

        const validPassword = await bcrypt.compare(req.body.password, userExists.password);
        if (!validPassword) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const userId = userExists._id;
        const token = jwt.sign({ userId }, tokenSecret, { expiresIn: '1h' });

        res.json({
            message: 'Sign-In Successful',
            token
        });
    } catch (err) {
        console.error('Error during signin:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all users
// Get all users
router.get('/bulk', authenticateToken, async (req, res) => {
    const filter = req.query.filter || '';

    try {
        // Find users excluding the currently logged-in user
        const users = await User.find({
            _id: { $ne: req.userId }, // Exclude the logged-in user
            $or: [
                { firstName: { $regex: filter, $options: 'i' } },
                { lastName: { $regex: filter, $options: 'i' } }
            ]
        });

        // Find the logged-in user
        const loggedInUser = await User.findById(req.userId);

        res.json({
            users: users.map(user => ({
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            })),
            loggedInUser: loggedInUser ? {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName
            } : null // Include logged-in user's first and last name
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
