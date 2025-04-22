const User = require('../models/User');

// GET /users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch users',
            error: err.message,
        });
    }
};

// POST /users
exports.createUser = async (req, res) => {
    const {name, password, email, firstname, lastname} = req.body;

    if (!name)
        return res.status(400).json({error: 'Name is required'});
    if (!password)
        return res.status(400).json({error: 'Password is required'});
    try {
        const user = await User.create({name, password, email, firstname, lastname});
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to create user',
            error: err.message,
        });
    }
};

// PUT /users/:id
exports.updateUser = async (req, res) => {
    const {id} = req.params;
    const {name, password, email, firstname, lastname} = req.body;

    try {
        const user = await User.findOneAndUpdate(
            {_id: id},
            {name, password, email, firstname, lastname},
            {new: true}
        );
        if (!user)
            return res.status(404).json({error: 'User not found'});
        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to update user',
            error: err.message,
        });
    }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await User.findOneAndDelete({_id: id});
        if (!user)
            return res.status(404).json({error: 'User not found'});
        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to delete user',
            error: err.message,
        });
    }
};
