const User = require('../Models/userModel');
const { generatePassword, comparePassword, generateToken } = require('../Config/authutils');

// Register a new user
const registerUser = async (req, res) => {
  let { name, password, email, confirmPassword } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  confirmPassword = confirmPassword.trim();

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await generatePassword(password);

    // Create a new user
    const newUser = new User({ name, password: hashedPassword, email });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error('Error registering user:', error); // Log the error for debugging
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Log in a user
const loginUser = async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Check if the password matches
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate a token
    const token = generateToken({ userId: user._id });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error); // Log the error for debugging
    res.status(500).json({ message: "Error logging in", error });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
