const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require('./models/user')

app.post('/signup', async (req, res) => {
    const user = new User({
        firstName: "Shreyansh",
        lastName: "Agarwal",
        emailID: "agarwalshrey78@gmail.com",
        password: "123456",
        age: "22",
    })
    try {
        await user.save()
    res.send('User registered successfully')
    } catch (error) {
        res.status(400).send(error.message)
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



