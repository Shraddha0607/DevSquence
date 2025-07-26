const mongoose = require('mongoose');
const validator = require('validator');

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
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error ("Invalid email address: " + value);
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error ("Enter a strong password: " + value);
            }
        },
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
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error ("Invalid Photo URL: " + value);
            }
        },
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