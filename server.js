require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 6000;

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

app.post('/employee', async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      // Check if email already exists
      const existingEmployee = await Contact.findOne({ email });
      if (existingEmployee) {
        return res.status(400).json({ error: 'DuplicateEmail', message: 'Email already exists' });
      }
      const newEmployee = new Contact({ name, email, phone });
      await newEmployee.save();
      res.status(201).json({ message: 'Contact added successfully', data: newEmployee });
    } catch (error) {
      res.status(500).json({ message: 'Error adding contact', error });
    }
  });

  app.delete('/contacts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Contact.findByIdAndDelete(id);
      if (result) {
        res.status(200).json({ message: 'Contact deleted successfully' });
      } else {
        res.status(404).json({ message: 'Contact not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting contact', error });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
