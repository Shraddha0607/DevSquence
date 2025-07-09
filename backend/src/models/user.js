const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error ("Gender data is not valid.");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.clipartmax.com/middle/m2i8b1b1i8A0Z5H7_shivaprakash-b-dummy-user/",
    },
    about: {
        type: String,
        default: "Default user"
    },
    skills: {
        type: [String]
    },
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;