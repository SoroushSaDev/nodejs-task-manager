const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, unique: true},
    firstname: {type: String},
    lastname: {type: String},
});

module.exports = mongoose.model('User', userSchema);
