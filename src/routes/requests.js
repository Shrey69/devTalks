const express = require('express')
const User = require('../models/user')
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');


requestRouter.post('/request/send/:status/:toUserID',userAuth ,async(req, res) => {
   try {
    const fromUserID = req.user._id;
    const toUserID = req.params.toUserID;
    const status = req.params.status;


    const isAllowed = ["ignored", "interested"];
    if(!isAllowed.includes(status)){
        throw new Error('Invalid status');
    }

    const check = await ConnectionRequest.findOne({
        $or: [
            {fromUserID, toUserID},
            {fromUserID: toUserID, toUserID: fromUserID}
        ]
    })
    if(check){
        return res.status(404).json({
            message: "Connection already established",
        })
    }

    const toUser = await User.findById(toUserID);
    if(!toUser){
        return res.status(404).json({
            message: "User not found",
        })
    }

    const connectionRequest = new ConnectionRequest({
        fromUserID,
        toUserID,
        status,
    })
    const data = await connectionRequest.save();

    res.json({
        message: "Connection request sent successfully",
        data,
    })

   } catch (error) {
    console.log(error.message)
    res.status(404).send("ERROR: " + error.message)
}
})

module.exports = requestRouter;