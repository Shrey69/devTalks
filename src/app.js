const express = require('express');
const connectDB = require("./config/database")
const app = express();


const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const authRouter =   require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/requests.js")

app.use(express.json());
app.use(cookieParser())


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)

connectDB()
.then(() => {
    console.log("Database Connected!");
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    })
}).catch((err) => {
    console.error("error");
   
})



