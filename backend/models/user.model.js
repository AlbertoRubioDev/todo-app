const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim:true,
        minlength: 3
    },
    password:{
        type: String,
        required: true,
        unique: false,
        minlength: 5
    },
    confirmed: {
            type: Boolean,
            default: false
    },
    registertoken:{
        type: String
    },
    todos:[{
        name: {type: String, required:false},
        description: {type: String, required: false},
        isdone: {type:Boolean, default: false}
    }]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
  
const User = mongoose.model('User', userSchema);

module.exports = User;