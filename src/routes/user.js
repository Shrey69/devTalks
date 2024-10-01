const express  = require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user')


const USER_SAFE_DATA = "firstName lastName gender age skills photoURL about";

userRouter.get("/user/requests", userAuth, async (req, res) => {
   
    try {   
        const loggedInUser = req.user;
        const requests = await ConnectionRequest
        .find({
            toUserID: loggedInUser._id,
            status: "interested"
        })
        .populate(
            "fromUserID",
            ["firstName", "lastName", "photoURL", "age", "gender", "skills","about"]
        )

        res.json({
            message: "User requests",
            data: requests
        })
        
    }catch (error) {
     res.status(404).send("ERROR: " + error.message)
}
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserID: loggedInUser._id, status: "accepted"},
                {toUserID: loggedInUser._id, status: "accepted"}]
        }).populate('fromUserID', ["firstName", "lastName", "gender", "age", "skills", "photoURL", "about"])
        .populate('toUserID', ["firstName", "lastName", "gender", "age", "skills", "photoURL", "about"])

        const data = connectionRequests.map((row) => {
            if(row.fromUserID._id.toString() === loggedInUser._id.toString()) {
                return row.toUserID;
              }
                 return row.fromUserID;
            })
         res.json({data})
    } catch (error) {
        res.status(404).send("ERROR: " + error.message)
   }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        // user should see all the card except :
        // his owncard, his connections, ignored ppl, already sent req.

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50? 50 : limit;
        const skip = (page -1) * limit;

        const connectReq = await ConnectionRequest.find({
            $or : [
                {fromUserID: loggedInUser._id},
                {toUserID: loggedInUser._id},
            ]
        }).select("fromUserID toUserID")

        const hideUsers = new Set();
        connectReq.forEach((req) => {
                hideUsers.add(req.fromUserID.toString());
                hideUsers.add(req.toUserID.toString());
        })

        const users = await User.find({
           $and: [
            { _id: {$nin: Array.from(hideUsers)}},
            { _id: {$ne: loggedInUser._id}}
           ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)


        res.send(users)


    } catch (error) {
        res.status(404).send("ERROR: " + error.message)
   }
})
module.exports = userRouter;