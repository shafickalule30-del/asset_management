const User = require('../models/User');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For session tokens

// =========================================================
// 1. TELEPHONE REGISTER CONTROLLER
// =========================================================
exports.register = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        if (!phoneNumber || !password) {
            return res.status(400).json({ message: "Please fill out all technical input markers." });
        }

        // Check if user already exists
        const userExists = await User.findOne({ phoneNumber });
        if (userExists) {
            return res.status(400).json({ message: "This phone number is already registered." });
        }

        // Securely hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save pure phone-centric user
        const newUser = new User({
            phoneNumber,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(201).json({ message: "Account created successfully using phone number!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server database connection error during registration." });
    }
};

// =========================================================
// 2. TELEPHONE SIGN IN CONTROLLER
// =========================================================
exports.login = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        if (!phoneNumber || !password) {
            return res.status(400).json({ message: "All input fields are required." });
        }

        // Query database directly matching the phone layout
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).json({ message: "Phone number not found." });
        }

        // Validate the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password." });
        }

        // Generate session JWT token
        const token = jwt.sign({ id: user._id }, 'YOUR_JWT_SECRET', { expiresIn: '1d' });

        return res.status(200).json({
            token,
            user: { id: user._id, phoneNumber: user.phoneNumber },
            message: "Access Granted!"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Login communication failed." });
    }
};