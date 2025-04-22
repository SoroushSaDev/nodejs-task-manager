const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
      },
    completed: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: {
          values: ['work', 'personal', 'shopping', 'health', 'other'],
          message: 'Category is not valid',
        },
        default: 'other',
      },
    tags: {
        type: [String],
        validate: {
            validator: function (val) {
                return Array.isArray(val)
            },
            message: 'Tags must be an array of strings',
        },
        default: [],
    },
    file: {
        type: String,
        default: null
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
