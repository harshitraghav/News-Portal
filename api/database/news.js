var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var newsSchema = new Schema({
    category:String,
    title:String,
    body:String,
    time: {
        type: Date,
        default: Date.now
    }
   
})

module.exports = mongoose.model('news', newsSchema);