const express = require('express');
const connectDB = require("./config/database")
const app = express();
const http = require('http');
require('dotenv').config()


const cookieParser = require('cookie-parser')
const authRouter =   require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/requests.js");
const userRouter = require('./routes/user.js');
const cors = require("cors");
const intializeSocket = require('./utils/socket.js');
const chatRouter = require('./routes/chat.js');
const port = process.env.PORT  ;
app.use(cors({
    origin: process.env.WEB_URL,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", chatRouter)

const server  = http.createServer(app)
intializeSocket(server)


connectDB()
.then(() => {
    console.log("Database Connected!");
    server.listen(port, () => {
        console.log('Server running on port 3000');
    })
}).catch((err) => {
    console.error("error");
    console.log(err);
})



