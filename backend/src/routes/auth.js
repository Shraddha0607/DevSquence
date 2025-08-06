const express = require('express');
const {validateSignUpData} = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {

    try {
        // Validation of data
        validateSignUpData(req);

        // Encrypt the password
        const {
            firstName,
            lastName,
            emailId,
            password
        } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        // creating a new instance of the User
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();
        res.send("User added successfully.");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const {
            emailId,
            password
        } = req.body;

        const user = await User.findOne({
            emailId: emailId
        });
        if (!user) {
            throw new Error("Invalid credentials!");
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials!");
        }

        // Create a JWT token
        const token = await user.getJWT();

        // Add the token to cookie and send the response back to the user
        res.cookie("token", token, {
            expires: new Date(Date.now() + 3 * 3600000),
        });
        res.send("Login successful.");

    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

authRouter.post("/logout", async (req,res) => {
    res.cookie("token", null, {
        expires: new Date (Date.now()),
    });
    res.send("Logout Successful !!");
});

module.exports = authRouter;

