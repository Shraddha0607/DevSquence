const express = require('express');
const {userAuth} = require('../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    // sending connection request
    console.log("Sending a connection request");

    res.send(user.firstName + " send the connect request!");
});

module.exports = requestRouter;