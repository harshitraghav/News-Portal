var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var regisSchema = new Schema({
    
    email: {
        type: String,
        unique: true
    },
    pass: String,
    mobile:String,
    date:{
        type:Date,
        default:Date.now
    },
    status:{
         type:Number,
         default:0
    }
})

module.exports = mongoose.model('regis', regisSchema);