const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: String,
    weight: Number,
    description: String,
    projectId: String
});

module.exports = mongoose.model('Task', TaskSchema);