const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require('./models/user')
const {validationSignUp} = require('../utils/validation')
const {bcrypt} = require('bcrypt')

app.use(express.json());
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
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(isPasswordValid){
            res.send('Logged in successfully')
        }else{
            throw new Error("Invalid credentials")
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.get('/user', async (req, res) => {
        const userEmail = req.body.emailID;

        try {
            const users = await User.find({ emailID: userEmail})
           if(users.length===0){
            res.status(404).send("User not found")
           }else{
            res.send(users);
           }
        } catch (error) {
            res.status(404).send("something went wrong")
        }
})


app.get('/feed', async (req, res) => {
   try {
    const users = await User.find({});
    res.send(users);
   } catch (error) {
    res.status(404).send("something went wrong")
}
})

app.patch('/user/:userID', async (req, res) => {
    const userID = req.params.userID;
    const data = req.body;

   
    try {
        const Allowed = [ "photoURL", "about", "gender","age", "skills"]
        const isAllowed = Object.keys(data).every((k) => Allowed.includes(k));
    
        if(!isAllowed){
          throw new Error("Update not allowed");
        }
        if(data?.skills.length >10){
            throw new Error("Skills array should not exceed 10 elements");
        }
        const users = await User.findByIdAndUpdate(userID, data, {
            returnDocument: "after",
            runValidators: true,
        })
        res.send(users);
    } catch (error) {
        res.status(404).send("UPDATE FAILED!!" + error.message);
    }
})

app.delete('/user', async (req, res) => {
    const userID = req.body.userID;
    try {
        const user = await User.findByIdAndDelete(userID);
        res.send("User deleted");
    }  catch (error) {
        res.status(404).send("something went wrong")
}
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



