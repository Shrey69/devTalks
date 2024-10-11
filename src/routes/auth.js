const express = require('express');
const authRouter = express.Router();
const User = require('../models/user')
const {validationSignUp} = require("../utils/validation")
const bcrypt = require('bcrypt');
const validator = require('validator')

authRouter.post('/signup', async (req, res) => {
    const {firstName, lastName, emailID, password} = req.body;
    try {
    validationSignUp(req)

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
        firstName,
        lastName,
        emailID,
        password: hashedPassword,
    })
   
      const saved =  await user.save()
      const token = await saved.getJWT()

      res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 86400000), // 24 hours
          httpOnly: true,
      })
    res.json({message:'User registered successfully', data:saved})
    } catch (error) {
        res.status(400).send(error.message)
    }
})

authRouter.post('/login', async (req, res) => {
    const { emailID, password} = req.body;
    try {
        if(!validator.isEmail(emailID)) {
            throw new Error("Email is not valid"+ emailID);
        }
        const user  = await User.findOne({ emailID: emailID});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password)

        if(isPasswordValid){
            const token = await user.getJWT()

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 86400000), // 24 hours
                httpOnly: true,
            })

            res.send(user)
        }else{
            throw new Error("ERROR: Invalid credentials")
        }

    } catch (error) {
        res.status(400).send(error.message)
        
    }
})

authRouter.post('/logout', (req, res) => {
    res.cookie("token", null,{
        expires: new Date(Date.now()),
    } )
    res.send("Logged out successfully")
})
module.exports = authRouter;