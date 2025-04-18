const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

exports.register = async (req, res) => {
    const {username, password} = req.body;

    try {
        const existingUser = await User.findOne({username});
        if (existingUser) return res.status(400).json({error: 'User already exists'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({username, password: hashedPassword});

        res.status(201).json({message: 'User registered successfully'});
    } catch (err) {
        res.status(500).json({error: 'Registration failed'});
    }
};

exports.login = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({username});
        if (!user) return res.status(401).json({error: 'Invalid credentials'});

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({error: 'Invalid credentials'});

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '1h'});
        res.json({token});
    } catch (err) {
        res.status(500).json({error: 'Login failed'});
    }
};
