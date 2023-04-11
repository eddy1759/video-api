const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const { Schema } = mongoose;

// User Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        type: String,
        required: true
    }]},
    {timestamp: true}
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

// Mmethod to check password
UserSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Method to add token to blacklist
UserSchema.methods.revokeToken = function(token) {
    this.tokens.push(token)
}
    

module.exports = mongoose.model('User', UserSchema);