const mongoDb = require("./config/database");
const express = require("express");
const app = express();
const User = require("./models/user");

// Crud
app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User added successfully.");
    } catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
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
})

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
        }else{
            res.send(user);
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong.");

    }
});

// delete a user from db
app.delete("/user", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.body.userId);
        console.log(user);
        res.send("User deleted successfully.");
    }catch (err) {
        res.status(400).send("Something went wrong.");
    }
});

// update a user from db
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const  ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => 
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error ("Update not allowed.");
        }
        if (data?.skills.length > 10) {
            throw new Error ("Skills cannot be more than 10");
        }

        const user = await User.findByIdAndUpdate({_id: userId }, data, {
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