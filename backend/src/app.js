const mongoDb = require("./config/database");
const express = require("express");
const app = express();
const User = require("./models/user");
const {
    validateSignUpData
} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require ("./middlewares/auth");

// Crud
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {

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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Error: "+ err.message);
    }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    // sending connection request
    console.log("Sending a connection request");

    res.send(user.firstName + " send the connect request!");
});

mongoDb()
    .then(() => {
        app.listen(7777, () => {
            console.log("server is started");
        });
    })
    .catch(err => {
        console.error("Some error occured.");
    });