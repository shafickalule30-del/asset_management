const User = require('../models/User');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For session tokens

// =========================================================
// 1. SYSTEM REGISTER CONTROLLER (Username & Email)
// =========================================================
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate all required fields are present
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill out all technical input markers (Username, Email, Password)." });
        }

        // Check if a user with this email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "This email address is already registered." });
        }

        // Check if a user with this username already exists
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: "This username is already taken." });
        }

        // Securely hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new machine asset-management user profile
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(201).json({ message: "Account created successfully!" });

    } catch (error) {
        console.error("Backend Register Error:", error);
        return res.status(500).json({ message: "Server database connection error during registration." });
    }
};

// =========================================================
// 2. SYSTEM SIGN IN CONTROLLER (Email & Password)
// =========================================================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required fields." });
        }

        // Query database directly matching the email layout
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or credentials." });
        }

        // Validate the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password." });
        }

        // Generate session JWT token (Use your actual environment secret variable here)
        const jwtSecret = process.env.JWT_SECRET || 'YOUR_JWT_SECRET';
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1d' });

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                walletBalance: user.walletBalance,
                balanceAccount: user.balanceAccount,
                activeMachines: user.activeMachines
            },
            message: "Access Granted!"
        });

    } catch (error) {
        console.error("Backend Login Error:", error);
        return res.status(500).json({ message: "Login communication failed." });
    }
};;