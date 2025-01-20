const express = require('express');
const connectDB = require("./config/database")
const app = express();
require('dotenv').config()


const cookieParser = require('cookie-parser')
const authRouter =   require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/requests.js");
const userRouter = require('./routes/user.js');
const cors = require("cors");
const port = process.env.PORT || 3000 ;
app.use(cors({
    origin: process.env.WEB_URL || "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

connectDB()
.then(() => {
    console.log("Database Connected!");
    app.listen(port, () => {
        console.log('Server running on port 3000');
    })
}).catch((err) => {
    console.error("error");
    console.log(err);
})



