var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var adminsSchema = new Schema({
    
    id: {
        type: String,
        unique: true
    },
    pass: String
})

module.exports = mongoose.model('admins', adminsSchema);