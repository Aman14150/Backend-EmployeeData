require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDb = require('./Config/mongoConfig');
const userRoutes = require('./Routes/userRoutes'); // Renamed from `router` to `userRoutes`
const employeeRoutes = require('./Routes/employeeRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDb().catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit the process with an error code
});

// Auth routes
app.use('/auth', userRoutes);

// Employee routes
app.use('/employees', employeeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
