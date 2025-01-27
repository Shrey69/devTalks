const socket = require('socket.io')
const crypto = require('crypto')
const { Chat } = require('../models/chat')

const getSecretRoomID = (userID, targetID) => {
    return crypto.createHash("sha256").update([userID, targetID].sort().join("_")).digest("hex")
 
}

const intializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: process.env.WEB_URL,
        }
    })
    
    io.on("connection", (socket)=> {
        socket.on("joinChat", ({userID, targetID, firstName}) => {
        const roomID = getSecretRoomID(userID, targetID)
        
        socket.join(roomID)
        })
        socket.on("sendMessage", async({userID, targetID, firstName,lastName, text}) => {
            
            //save messages in the database
            try {
                const roomID = getSecretRoomID(userID, targetID)

                let chat = await Chat.findOne({
                    participants: { $all : [userID, targetID]}
                })

                if(!chat){
                    chat = new Chat({
                        participants: [userID, targetID],
                        messages: [],
                    })
                }
                chat.messages.push({
                    senderID: userID,
                    text, 
                })
                await chat.save()
                io.to(roomID).emit("receiveMessage", {userID, firstName,lastName, text})
            
            } catch (error) {
                console.error(error)
            }

            
        })
        socket.on("disconnect", () => {}) 
    })
}

module.exports = intializeSocket;