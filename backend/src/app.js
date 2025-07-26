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

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials!");
        }

        // Create a JWT token
        const token = await jwt.sign({
            _id: user._id
        }, "DevTinder@9876");

        // Add the token to cookie and send the response back to the user
        res.cookie("token", token);
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

// Get user by email
app.get("/user", async (req, res) => {
    console.log(req.body);
    const userEmail = req.body.emailId;

    try {
        const user = await User.findOne({
            emailId: userEmail
        });
        if (!user) {
            res.status(404).send("User not found!");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("Something went wrong.");
    }
});

// Feed api - Get /feed  - get all the users from db
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("No user found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong.");
    }
});

app.get("/userById", async (req, res) => {
    try {
        const user = await User.findById(req.body.id);
        if (!user) {
            res.status(404).send("User not found.");
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("Something went wrong.");

    }
});

// delete a user from db
app.delete("/user", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.body.userId);
        console.log(user);
        res.send("User deleted successfully.");
    } catch (err) {
        res.status(400).send("Something went wrong.");
    }
});

// update a user from db
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed.");
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }

        const user = await User.findByIdAndUpdate({
            _id: userId
        }, data, {
            returnDocument: "after",
            runValidators: true,
        });
        console.log(user);
        res.send("User updated successfully.");
    } catch (err) {
        res.status(400).send("Update failed: " + err.message);
    }
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