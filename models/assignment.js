const mongoose = require('mongoose');

const assignSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    task: { type: String, required: true },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {type: String}
})

const Assign = mongoose.model('Assign', assignSchema);
module.exports = Assign; 