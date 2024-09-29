const express = require('express')
const {validateProfileEdit} = require('../utils/validation')
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");

profileRouter.get('/profile/view',userAuth, async (req, res) => {
    try{ 
    const user = req.user;
    res.send(user);
 
    } catch (error) {
     res.status(404).send("something went wrong")
 }
 
 })

 profileRouter.patch('/profile/edit', userAuth, async(req, res) => {
        try {
           if(!validateProfileEdit(req)){
            throw new Error('Invalid Edit request');
           }
           const user = req.user;
           Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
           
           await user.save();

           res.json({
            message: `${user.firstName}, your profile updated successfully.`,
            data:user,
            })

        }  catch (error) {
            res.status(404).send("something went wrong")
        }
 })


module.exports = profileRouter;