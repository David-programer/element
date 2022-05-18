const {Schema, model } = require('mongoose');

module.exports = model('user', new Schema({
    type: {type: String,  reqiured: true},
    name: {type: String,  required: true},
    email: {type: String,  required: true},
    phone: {type: String,  required: true},
    password: {type: String,  reqiured: true}
}));