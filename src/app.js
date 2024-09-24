const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require('./models/user')


app.use(express.json());
app.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
    res.send('User registered successfully')
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

app.patch('/user', async (req, res) => {
   
    try {
        const userID = req.body.userID;
        const data = req.body;
        const users = await User.findByIdAndUpdate(userID, data)
        res.send(users);
    } catch (error) {
        res.status(404).send("something went wrong")
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



