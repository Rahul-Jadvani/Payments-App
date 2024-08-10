const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { dbConnection } = require('./DataBase/db');
const userRouter = require('./Routes/user');
const accountRouter = require('./Routes/account')

dotenv.config();

const app = express();

// Middleware
app.use(cors(
    
));
app.use(express.json());

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter)

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "An unexpected error occurred!" });
});

// Database Connection
(async () => {
    try {
        await dbConnection();
        // Start the Server
        const port = process.env.PORT || 5500; // Default to 5500 if not set
        app.listen(port, () => {
            console.log(`Server is listening...`);
        });

    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
})();
