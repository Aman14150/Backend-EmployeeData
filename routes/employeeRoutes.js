const express = require('express');
const Employee = require('../Models/employeeModel');
const { authMiddleware } = require('../controllers/authHandler');
const router = express.Router();

// Get employees with optional search query and pagination
router.get('/', authMiddleware, async (req, res) => {
    const { search, page = 1, limit = 5 } = req.query;
    try {
        let query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query = {
                $or: [
                    { name: searchRegex },
                    { email: searchRegex },
                    { phone: searchRegex },
                ],
            };
        }
        const contacts = await Employee.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const totalContacts = await Employee.countDocuments(query);
        res.status(200).json({ contacts, totalContacts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error });
    }
});

// Post multiple employees
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ error: 'DuplicateEmail', message: 'Email already exists' });
        }
        const newEmployee = new Employee({ name, email, phone });
        await newEmployee.save();
        res.status(201).json({ message: 'Data added successfully', data: newEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Error adding contact', error });
    }
});

// Delete a specific employee by ID
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Employee.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting data', error });
    }
});

// Update an employee by ID
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const updatedContact = await Employee.findByIdAndUpdate(id, { name, email, phone }, { new: true });
        if (updatedContact) {
            res.status(200).json({ message: 'Data updated successfully', data: updatedContact });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating data', error });
    }
});

// Delete all contacts
router.delete('/', authMiddleware, async (req, res) => {
    try {
        await Employee.deleteMany({});
        res.status(200).json({ message: 'All employees deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employees', error });
    }
});

module.exports = router;
