require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const Contact = mongoose.model("employee", contactSchema);

// Get all contacts
app.get("/employee", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error });
  }
});

// Post multiple employees
app.post('/employee', async (req, res) => {
  try {
    const employees = req.body; // Expecting an array of employee objects

    if (!Array.isArray(employees)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of employees.' });
    }

    // Check for duplicates and insert employees
    const results = [];
    const errors = [];

    for (const employee of employees) {
      const { name, email, phone } = employee;
      const existingEmployee = await Contact.findOne({ email });

      if (existingEmployee) {
        errors.push({ email, message: 'Email already exists' });
      } else {
        const newEmployee = new Contact({ name, email, phone });
        const savedEmployee = await newEmployee.save();
        results.push(savedEmployee);
      }
    }

    if (results.length > 0) {
      res.status(201).json({
        message: 'Employees added successfully',
        data: results,
        errors
      });
    } else {
      res.status(400).json({ message: 'No employees added', errors });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding employees', error });
  }
});

  // Delete a specific employee by ID
app.delete('/employee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: 'Data deleted successfully' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data', error });
  }
});


  app.put('/employee/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;
      const updatedContact = await Contact.findByIdAndUpdate(id, { name, email, phone }, { new: true });
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
app.delete("/employee", async (req, res) => {
  try {
    await Contact.deleteMany({});
    res.status(200).json({ message: "All employees deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employees", error });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
