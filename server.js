require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDb = require('./config/mongoConfig');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDb();

// Auth routes
app.use('/api/auth', userRoutes);

// Employee routes
app.use('/api/employees', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
