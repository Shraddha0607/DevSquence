const mongoDb = require("./config/database");
const express = require("express");
const app = express();
const {
    validateSignUpData
} = require("./utils/validation");
const cookieParser = require("cookie-parser");
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

// Crud
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

mongoDb()
    .then(() => {
        app.listen(7777, () => {
            console.log("server is started");
        });
    })
    .catch(err => {
        console.error("Some error occured.");
    });