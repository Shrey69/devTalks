const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require('./models/user')
const {validationSignUp} = require("./utils/validation")
const bcrypt = require('bcrypt');
const validator = require('validator')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const {userAuth} = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser())

app.post('/signup', async (req, res) => {
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
   
        await user.save()
    res.send('User registered successfully')
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.post('/login', async (req, res) => {
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

            res.send('Logged in successfully')
        }else{
            throw new Error("Invalid credentials")
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.get('/profile',userAuth, async (req, res) => {
   try{ 
   const user = req.user;
   res.send(user);

   } catch (error) {
    res.status(404).send("something went wrong")
}

})

app.post('/sendConnectionRequest',userAuth ,async(req, res) => {
    const user = req.user;
    res.send(user.firstName + " sent a connection request")
})


connectDB()
.then(() => {
    console.log("Database Connected!");
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    })
}).catch((err) => {
    console.error("error");
   
})



