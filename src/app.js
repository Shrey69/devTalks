const express = require('express');
const connectDB = require("./config/database")
const app = express();


const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const authRouter =   require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/requests.js");
const userRouter = require('./routes/user.js');
const cors = require("cors");
const port = process.env.PORT || 3000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true  // Indicates that the client supports sending cookies.  // This is needed for secure cookies.  // Secure cookies are only transmitted over HTTPS.  // If the client does not support sending cookies, the server should not set or send secure cookies.  // This is usually set to true in production.  // In development, set it to false to prevent sending cookies over HTTP.  // Note: Setting this option to false might make your site vulnerable to cross-site request
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
})



